#!/bin/bash

# Get the absolute path to the project directory (parent of toolbox)
PROJECT_DIR="$( pwd )"

echo $PROJECT_DIR

osascript <<EOF
tell application "iTerm"
    activate
    
    # Create new window
    create window with default profile
    
    # Micro-Service: HealthCheck
    tell current session of current window
        write text "cd '$PROJECT_DIR' && pnpm dev:auth"
    end tell
    
    # Micro-Service: Authentication
    tell current session of current window
        split vertically with default profile
    end tell
    tell second session of current tab of current window
        write text "cd '$PROJECT_DIR' && pnpm dev:backend"
    end tell
    
    # Micro-Service: Users
    tell second session of current tab of current window
        split vertically with default profile
    end tell
    tell third session of current tab of current window
        write text "cd '$PROJECT_DIR' && pnpm dev:books"
    end tell
    
    # Micro-Service: Books
    tell third session of current tab of current window
        split vertically with default profile
    end tell
    tell fourth session of current tab of current window
        write text "cd '$PROJECT_DIR' && pnpm dev:dragons"
    end tell
    
    # Micro-Service: Dragons
    tell fourth session of current tab of current window
        split vertically with default profile
    end tell
    tell fifth session of current tab of current window
        write text "cd '$PROJECT_DIR' && pnpm dev:file-upload"
    end tell
    
    # Micro-Service: FileUpload
    tell fourth session of current tab of current window
        split vertically with default profile
    end tell
    tell fifth session of current tab of current window
        write text "cd '$PROJECT_DIR' && pnpm dev:micro users"
    end tell
end tell
EOF