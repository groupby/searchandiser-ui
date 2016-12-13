#!/usr/bin/env bash

./package.sh

rm -r ../barnes-and-noble/node_modules/searchandiser-ui/dist/src/*
cp -R ./dist/src/* ../barnes-and-noble/node_modules/searchandiser-ui/dist/src/
