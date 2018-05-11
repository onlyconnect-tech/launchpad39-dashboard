#!/bin/bash

page_size=`getconf PAGESIZE`

#########################
#   https://askubuntu.com/questions/46627/how-can-i-make-a-script-that-opens-terminal-windows-and-executes-commands-in-the
#########################
curr_dir=`pwd`

echo "starting http-server"

process_id=`/bin/ps -fe | grep "http-server" | grep -v "grep" | awk '{print $2}'`

if [ -n "$process_id" ]; then
    echo "http-server - PID:$process_id - yet running"
else
    mate-terminal --title="DASHBOARD WEB SERVER" -e "http-server" &
fi

cd ../launchpad39-admin-vehicles

echo "starting server-admin-vehicles"

process_id_admin_vehicles=`/bin/ps -fe | grep "server-admin-vehicles.js" | grep -v "grep" | awk '{print $2}'`

if [ -n "$process_id_admin_vehicles" ]; then
    echo "server_admin_vehicles - PID:$process_id_admin_vehicles - yet running"
else
    mate-terminal --title="ADMIN VEHICLES" -e "node server-admin-vehicles.js" &
fi

# server-permission-service.js

cd ../launchpad39-permission-service

echo "starting server-permission-service"

process_id_permission_service=`/bin/ps -fe | grep "server-permission-service.js" | grep -v "grep" | awk '{print $2}'`

if [ -n "$process_id_permission_service" ]; then
    echo "server_permission_service - PID:$process_id_permission_service - yet running"
else
    mate-terminal --title="PERMISSION SERVICE" -e "node server-permission-service.js" &
fi

# server_syncronizer_DB.js

cd ../launchpad39-server

echo "starting server_synchronizer_DB"

process_id_synchronizer_DB=`/bin/ps -fe | grep "server_synchronizer_DB.js" | grep -v "grep" | awk '{print $2}'`

if [ -n "$process_id_synchronizer_DB" ]; then
    #echo `cat /proc/${process_id}/smaps`
    # mem_res mem_shared
    mems=(`cat /proc/${process_id_synchronizer_DB}/statm | awk '{print $2 " " $3}'`) 
    echo  "Mem Res KB ->" $((${mems[0]} * $page_size / 1024 ))
    echo  "Mem Sha KB ->" $((${mems[1]} * $page_size / 1024 ))
    echo "server_synchronizer_DB - PID:$process_id_synchronizer_DB - yet running"
else
    mate-terminal --title="SERVER DB SYNCHRONIZER" -e "node server_synchronizer_DB.js" &
fi

# server_ccs_dashboard_backend.js

echo "starting server_ccs_dashboard_backend"

process_id_dashboard_backend=`/bin/ps -fe | grep "server_ccs_dashboard_backend.js" | grep -v "grep" | awk '{print $2}'`

if [ -n "$process_id_dashboard_backend" ]; then
    #echo `cat /proc/${process_id}/smaps`
    # mem_res mem_shared
    mems=(`cat /proc/${process_id_dashboard_backend}/statm | awk '{print $2 " " $3}'`) 
    echo  "Mem Res KB ->" $((${mems[0]} * $page_size / 1024 ))
    echo  "Mem Sha KB ->" $((${mems[1]} * $page_size / 1024 ))
    echo "server_dashboard_backend - PID:$process_id_dashboard_backend - yet running"
else
    mate-terminal --title="CCS_DASHBOARD_BACKEND" -e "node server_ccs_dashboard_backend.js" &
fi









