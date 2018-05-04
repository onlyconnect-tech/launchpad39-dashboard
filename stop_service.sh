process_id=`/bin/ps -fe | grep "http-server" | grep -v "grep" | grep -v "mate-terminal" | awk '{print $2}'`

if [ -n "$process_id" ]; then
    echo "KILLING http-server - PID:$process_id"
    kill -9 $process_id
else
    echo "http-server not running"
fi

process_id_admin_vehicles=`/bin/ps -fe | grep "server-admin-vehicles.js" | grep -v "grep" | grep -v "mate-terminal" | awk '{print $2}'`

if [ -n "$process_id_admin_vehicles" ]; then
    echo "KILLING server_admin_vehicles - PID:$process_id_admin_vehicles"
    kill -9 $process_id_admin_vehicles
else
    echo "server_admin_vehicles not running"
fi

# server-permission-service.js

process_id_permission_service=`/bin/ps -fe | grep "server-permission-service.js" | grep -v "grep" | grep -v "mate-terminal" | awk '{print $2}'`

if [ -n "$process_id_permission_service" ]; then
    echo "KILLING server_permission_service - PID:$process_id_permission_service"
    kill -9 $process_id_permission_service
else
    echo "server_permission_service not running"
fi

# server_syncronizer_DB.js

process_id_synchronizer_DB=`/bin/ps -fe | grep "server_synchronizer_DB.js" | grep -v "grep" | grep -v "mate-terminal" | awk '{print $2}'`

if [ -n "$process_id_synchronizer_DB" ]; then
    echo "KILLING server_synchronizer_DB - PID:$process_id_synchronizer_DB"
    kill -9 $process_id_synchronizer_DB
else
    echo "server_synchronizer_DB not running"
fi

# server_ccs_dashboard_backend.js

process_id_dashboard_backend=`/bin/ps -fe | grep "server_ccs_dashboard_backend.js" | grep -v "grep" | grep -v "mate-terminal" | awk '{print $2}'`

if [ -n "$process_id_dashboard_backend" ]; then
    echo "KILLING server_dashboard_backend - PID:$process_id_dashboard_backend"
    kill -9 $process_id_dashboard_backend
else
    echo "server_dashboard_backend not running"
fi




