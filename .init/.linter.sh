#!/bin/bash
cd /home/kavia/workspace/code-generation/slack-clone-ui-210375-210390/frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

