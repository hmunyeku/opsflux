#!/usr/bin/env bash
# ============================================
# WAIT-FOR-IT - Script d'attente de services
# Source: https://github.com/vishnubob/wait-for-it
# ============================================

TIMEOUT=15
QUIET=0
HOST=""
PORT=""

usage() {
    cat << USAGE >&2
Usage:
    $0 host:port [-t timeout] [-- command args]
    -q | --quiet                        Ne pas afficher de sortie
    -t TIMEOUT | --timeout=timeout      Timeout en secondes, zéro pour aucun timeout
    -- COMMAND ARGS                     Exécuter la commande avec les arguments après le test
USAGE
    exit 1
}

wait_for() {
    if [[ $TIMEOUT -gt 0 ]]; then
        for i in `seq $TIMEOUT` ; do
            nc -z "$HOST" "$PORT" > /dev/null 2>&1
            result=$?
            if [[ $result -eq 0 ]]; then
                if [[ $QUIET -ne 1 ]]; then echo "✅ $HOST:$PORT est disponible"; fi
                return 0
            fi
            sleep 1
        done
        echo "❌ Timeout après ${TIMEOUT}s en attente de $HOST:$PORT" >&2
        return 1
    else
        while :; do
            nc -z "$HOST" "$PORT" > /dev/null 2>&1
            result=$?
            if [[ $result -eq 0 ]]; then
                if [[ $QUIET -ne 1 ]]; then echo "✅ $HOST:$PORT est disponible"; fi
                return 0
            fi
            sleep 1
        done
    fi
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        *:* )
            HOST=$(printf "%s\n" "$1"| cut -d : -f 1)
            PORT=$(printf "%s\n" "$1"| cut -d : -f 2)
            shift 1
            ;;
        -q | --quiet)
            QUIET=1
            shift 1
            ;;
        -t)
            TIMEOUT="$2"
            if [[ $TIMEOUT == "" ]]; then break; fi
            shift 2
            ;;
        --timeout=*)
            TIMEOUT="${1#*=}"
            shift 1
            ;;
        --)
            shift
            break
            ;;
        --help)
            usage
            ;;
        *)
            echo "Argument inconnu: $1"
            usage
            ;;
    esac
done

if [[ "$HOST" == "" || "$PORT" == "" ]]; then
    echo "❌ Erreur: vous devez fournir un host et un port à tester."
    usage
fi

wait_for

if [[ $# -gt 0 ]]; then
    exec "$@"
fi

exit 0
