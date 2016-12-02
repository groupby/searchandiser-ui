http-server -s -p 9090 test/e2e/demo & SERVER_PID=$!

set -o pipefail

nightwatch "$@"
EXIT_CODE=$?

kill -9 $SERVER_PID

exit $EXIT_CODE
