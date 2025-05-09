#!/bin/bash
docker build --platform=linux/amd64 -t phamvant/forum:x86 .
docker push phamvant/forum:x86