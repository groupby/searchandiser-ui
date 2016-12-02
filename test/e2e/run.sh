http-server -p 9090 test/e2e/demo & SERVER_PID=$!

set -o pipefail

EXIT_CODE=$(nightwatch "$@")

kill -9 $SERVER_PID

echo $EXIT_CODE

set +o pipefail

exit $EXIT_CODE
