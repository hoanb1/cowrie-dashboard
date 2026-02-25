#!/usr/bin/env python3
"""
Shared IP utilities for Cowrie Dashboard services.
Provides private IP detection, bounded collections for memory-safe stats tracking.
"""

import ipaddress
import threading
from typing import Any, Dict, Optional, Set


# Pre-compiled private/reserved networks (shared across services)
_PRIVATE_NETWORKS = (
    ipaddress.ip_network('10.0.0.0/8'),
    ipaddress.ip_network('172.16.0.0/12'),
    ipaddress.ip_network('192.168.0.0/16'),
    ipaddress.ip_network('127.0.0.0/8'),
    ipaddress.ip_network('169.254.0.0/16'),
    ipaddress.ip_network('::1/128'),
    ipaddress.ip_network('fc00::/7'),
    ipaddress.ip_network('fe80::/10'),
)


def is_private_ip(ip_address: str) -> bool:
    """Check if IP is private/reserved. Shared across GeoIP and ASN services."""
    try:
        addr = ipaddress.ip_address(ip_address)
        return any(addr in net for net in _PRIVATE_NETWORKS)
    except ValueError:
        return False


class BoundedCounter:
    """Thread-safe dict-like counter with max size.
    When capacity is exceeded, evicts the least-frequent entries (bottom 10%).
    """

    def __init__(self, maxsize: int = 10000):
        self._data: Dict[str, int] = {}
        self._maxsize = maxsize
        self._lock = threading.Lock()

    def increment(self, key: str) -> int:
        """Increment counter for key, return new count."""
        with self._lock:
            self._data[key] = self._data.get(key, 0) + 1
            count = self._data[key]
            self._maybe_evict()
            return count

    def _maybe_evict(self) -> None:
        """Evict bottom 10% if over capacity."""
        if len(self._data) > self._maxsize:
            evict_count = max(1, self._maxsize // 10)
            sorted_keys = sorted(self._data, key=self._data.get)
            for k in sorted_keys[:evict_count]:
                del self._data[k]

    def __getitem__(self, key: str) -> int:
        return self._data.get(key, 0)

    def __setitem__(self, key: str, value: int) -> None:
        with self._lock:
            self._data[key] = value
            self._maybe_evict()

    def __contains__(self, key: str) -> bool:
        return key in self._data

    def __len__(self) -> int:
        return len(self._data)

    def get(self, key: str, default: int = 0) -> int:
        return self._data.get(key, default)

    def items(self):
        return self._data.items()

    def top(self, n: int = 10) -> Dict[str, int]:
        """Return top N entries sorted by count descending."""
        with self._lock:
            return dict(sorted(self._data.items(), key=lambda x: x[1], reverse=True)[:n])


class BoundedSet:
    """Thread-safe set with max size. Once full, new additions are counted but the set
    stops growing. The count property gives the total unique items seen.
    """

    def __init__(self, maxsize: int = 50000):
        self._data: Set[str] = set()
        self._maxsize = maxsize
        self._overflow_count: int = 0
        self._lock = threading.Lock()

    def add(self, item: str) -> None:
        with self._lock:
            if item in self._data:
                return
            if len(self._data) < self._maxsize:
                self._data.add(item)
            else:
                self._overflow_count += 1

    def __len__(self) -> int:
        """Returns count of items stored (not including overflow)."""
        return len(self._data)

    @property
    def total_seen(self) -> int:
        """Total unique items seen, including those dropped due to overflow."""
        return len(self._data) + self._overflow_count

    def __contains__(self, item: str) -> bool:
        return item in self._data
