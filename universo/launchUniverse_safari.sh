#!/bin/bash
open -a Safari /Users/JP/Documents/Aptana_Studio_Workspace/universo/src/index.html;/usr/bin/osascript -e 'tell application "Safari"' -e "activate" -e 'tell application "System Events"' -e 'keystroke "r" using {control down, command down}' -e "end tell" -e 'tell application "System Events"' -e 'keystroke "f" using {control down, command down}' -e "end tell" -e "end tell"
