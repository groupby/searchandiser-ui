http-server -s -p 9090 test/e2e/demo & SERVER_PID=$!

set -o pipefail

nightwatch "$@"

kill -9 $?

exit $EXIT_CODE
