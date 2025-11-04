#!/bin/bash
cd /home/kavia/workspace/code-generation/personal-notes-web-app-39302-39311/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

