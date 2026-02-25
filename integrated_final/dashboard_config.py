#!/usr/bin/env python3
"""
Centralized configuration for Cowrie Dashboard.
All settings can be overridden via environment variables.
"""

import os

# --- Server ---
DASHBOARD_HOST = os.environ.get('DASHBOARD_HOST', '0.0.0.0')
DASHBOARD_PORT = int(os.environ.get('DASHBOARD_PORT', '3333'))

# --- Cowrie Log ---
COWRIE_LOG_PATH = os.environ.get(
    'COWRIE_LOG_PATH',
    '/home/cowrie/cowrie/var/log/cowrie/cowrie.json'
)

# --- GeoIP ---
GEOIP_DB_PATH = os.environ.get(
    'GEOIP_DB_PATH',
    '/home/cowrie/cowrie-dashboard/data/GeoLite2-City.mmdb'
)
GEOIP_CACHE_MAXSIZE = int(os.environ.get('GEOIP_CACHE_MAXSIZE', '4096'))
GEOIP_CACHE_TTL = int(os.environ.get('GEOIP_CACHE_TTL', '3600'))

# --- ASN ---
ASN_DB_PATH = os.environ.get(
    'ASN_DB_PATH',
    '/home/cowrie/cowrie-dashboard/data/GeoLite2-ASN.mmdb'
)
ASN_CACHE_MAXSIZE = int(os.environ.get('ASN_CACHE_MAXSIZE', '2048'))
ASN_CACHE_TTL = int(os.environ.get('ASN_CACHE_TTL', '3600'))
ASN_REQUEST_TIMEOUT = int(os.environ.get('ASN_REQUEST_TIMEOUT', '5'))
ASN_RATE_LIMIT = float(os.environ.get('ASN_RATE_LIMIT', '1.0'))
ASN_RATE_BURST = int(os.environ.get('ASN_RATE_BURST', '3'))

# --- Stats Collection Limits ---
MAX_MAP_MARKERS = int(os.environ.get('MAX_MAP_MARKERS', '1000'))
MAX_RECENT_ATTACKS = int(os.environ.get('MAX_RECENT_ATTACKS', '100'))
MAX_TIMELINE_ENTRIES = int(os.environ.get('MAX_TIMELINE_ENTRIES', '50'))
MAX_ALERTS = int(os.environ.get('MAX_ALERTS', '50'))
MAX_UNIQUE_IPS = int(os.environ.get('MAX_UNIQUE_IPS', '50000'))
MAX_UNIQUE_PASSWORDS = int(os.environ.get('MAX_UNIQUE_PASSWORDS', '20000'))
MAX_UNIQUE_USERS = int(os.environ.get('MAX_UNIQUE_USERS', '10000'))
MAX_TOP_ENTRIES = int(os.environ.get('MAX_TOP_ENTRIES', '10000'))

# --- Security ---
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '')  # comma-separated, empty = same-origin only
DASHBOARD_USERNAME = os.environ.get('DASHBOARD_USERNAME', 'admin')
DASHBOARD_PASSWORD = os.environ.get('DASHBOARD_PASSWORD', 'Cowrie@2026!')
SECRET_KEY = os.environ.get('COWRIE_SECRET_KEY', '')

# --- Performance ---
STATS_CACHE_TTL = float(os.environ.get('STATS_CACHE_TTL', '2.0'))  # seconds
LOG_POLL_INTERVAL = float(os.environ.get('LOG_POLL_INTERVAL', '1.0'))  # seconds
STATS_PUSH_INTERVAL = float(os.environ.get('STATS_PUSH_INTERVAL', '15.0'))  # seconds
ENRICHMENT_QUEUE_SIZE = int(os.environ.get('ENRICHMENT_QUEUE_SIZE', '1000'))

# --- API Rate Limiting ---
API_RATE_LIMIT = os.environ.get('API_RATE_LIMIT', '30/minute')
