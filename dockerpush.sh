#!/bin/bash

docker build --platform=linux/amd64 -t phamvant/forum:x86 .

docker push phamvant/forum:x86

ssh -i ~/.aws/admin-macbook.pem ec2-user@ec2-52-194-240-247.ap-northeast-1.compute.amazonaws.com 'bash /home/ec2-user/restart.sh'