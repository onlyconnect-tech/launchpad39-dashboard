curr_dir=`pwd`

echo "starting http-server"

process_id=`/bin/ps -fe | grep "http-server" | grep -v "grep" | awk '{print $2}'`

if [ -n "$process_id" ]; then
    echo "http-server - PID:$process_id - yet running"
else
    nohup http-server >/dev/null 2>&1 &
fi

cd ../ccs-dashboard-admin-vehicles

echo "starting server-admin-vehicles"

process_id_admin_vehicles=`/bin/ps -fe | grep "server-admin-vehicles.js" | grep -v "grep" | awk '{print $2}'`

if [ -n "$process_id_admin_vehicles" ]; then
    echo "server_admin_vehicles - PID:$process_id_admin_vehicles - yet running"
else
    nohup node server-admin-vehicles.js >/dev/null 2>&1 &
fi

# server-permission-service.js

cd ../ccs-dashboard-permission-service

echo "starting server-permission-service"

process_id_permission_service=`/bin/ps -fe | grep "server-permission-service.js" | grep -v "grep" | awk '{print $2}'`

if [ -n "$process_id_permission_service" ]; then
    echo "server_permission_service - PID:$process_id_permission_service - yet running"
else
    nohup node server-permission-service.js >/dev/null 2>&1 &
fi

# server_syncronizer_DB.js

cd ../ccs-dashboard-server/

echo "starting server_synchronizer_DB"

process_id_synchronizer_DB=`/bin/ps -fe | grep "server_synchronizer_DB.js" | grep -v "grep" | awk '{print $2}'`

if [ -n "$process_id_synchronizer_DB" ]; then
    echo "server_synchronizer_DB - PID:$process_id_synchronizer_DB - yet running"
else
    nohup node server_synchronizer_DB.js >/dev/null 2>&1 &
fi

# server_ccs_dashboard_backend.js

echo "starting server_ccs_dashboard_backend"

process_id_dashboard_backend=`/bin/ps -fe | grep "server_ccs_dashboard_backend.js" | grep -v "grep" | awk '{print $2}'`

if [ -n "$process_id_dashboard_backend" ]; then
    echo "server_dashboard_backend - PID:$process_id_dashboard_backend - yet running"
else
    nohup node server_ccs_dashboard_backend.js >/dev/null 2>&1 &
fi









