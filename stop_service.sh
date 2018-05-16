#!/bin/bash

process_id_admin_vehicles=`/bin/ps -fe | grep "server-admin-vehicles.js" | grep -v "grep" | grep -v "mate-terminal" | awk '{print $2}'`

if [ -n "$process_id_admin_vehicles" ]; then
    echo "KILLING server_admin_vehicles - PID:$process_id_admin_vehicles"
    kill $process_id_admin_vehicles
else
    echo "server_admin_vehicles not running"
fi

# server_syncronizer_DB.js

process_id_synchronizer_DB=`/bin/ps -fe | grep "server_synchronizer_DB.js" | grep -v "grep" | grep -v "mate-terminal" | awk '{print $2}'`

if [ -n "$process_id_synchronizer_DB" ]; then
    echo "KILLING server_synchronizer_DB - PID:$process_id_synchronizer_DB"
    kill $process_id_synchronizer_DB
else
    echo "server_synchronizer_DB not running"
fi

# server_ccs_dashboard_backend.js

process_id_dashboard_backend=`/bin/ps -fe | grep "server_ccs_dashboard_backend.js" | grep -v "grep" | grep -v "mate-terminal" | awk '{print $2}'`

if [ -n "$process_id_dashboard_backend" ]; then
    echo "KILLING server_dashboard_backend - PID:$process_id_dashboard_backend"
    kill $process_id_dashboard_backend
else
    echo "server_dashboard_backend not running"
fi




