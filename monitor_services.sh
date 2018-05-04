# view http://man7.org/linux/man-pages/man5/proc.5.html for explanation on memory

curr_dir=`pwd`
page_size=`getconf PAGESIZE`

echo "monitoring http-server"

process_id=`/bin/ps -fe | grep "http-server" | grep -v "grep" | grep -v "mate-terminal" | awk '{print $2}'`

if [ -n "$process_id" ]; then
    echo "http-server - PID:$process_id - running"
    #echo `cat /proc/${process_id}/smaps`
    # mem_res mem_shared
    mems=(`cat /proc/${process_id}/statm | awk '{print $2 " " $3}'`) 
    echo  "Mem Res KB ->" $((${mems[0]} * $page_size / 1024 ))
    echo  "Mem Sha KB ->" $((${mems[1]} * $page_size / 1024 ))		
else
    echo "http-server NOT running"
fi

cd ../ccs-dashboard-admin-vehicles

echo "monitoring server-admin-vehicles"

process_id_admin_vehicles=`/bin/ps -fe | grep "server-admin-vehicles.js" | grep -v "grep" | grep -v "mate-terminal" | awk '{print $2}'`

if [ -n "$process_id_admin_vehicles" ]; then
    echo "server_admin_vehicles - PID:$process_id_admin_vehicles - running"
    mems=(`cat /proc/${process_id_admin_vehicles}/statm | awk '{print $2 " " $3}'`) 
    echo  "Mem Res KB ->" $((${mems[0]} * $page_size / 1024 ))
    echo  "Mem Sha KB ->" $((${mems[1]} * $page_size / 1024 ))	
else
    echo "server_admin_vehicles NOT running"
fi

# server-permission-service.js

cd ../ccs-dashboard-permission-service

echo "monitoring server-permission-service"

process_id_permission_service=`/bin/ps -fe | grep "server-permission-service.js" | grep -v "grep" | grep -v "mate-terminal" | awk '{print $2}'`

if [ -n "$process_id_permission_service" ]; then
    echo "server_permission_service - PID:$process_id_permission_service - running"
    mems=(`cat /proc/${process_id_permission_service}/statm | awk '{print $2 " " $3}'`) 
    echo  "Mem Res KB ->" $((${mems[0]} * $page_size / 1024 ))
    echo  "Mem Sha KB ->" $((${mems[1]} * $page_size / 1024 ))	
else
    echo "server_permission_service NOT running"
fi

# server_syncronizer_DB.js

cd ../ccs-dashboard-server/

echo "monitoring server_synchronizer_DB"

process_id_synchronizer_DB=`/bin/ps -fe | grep "server_synchronizer_DB.js" | grep -v "grep" | grep -v "mate-terminal" | awk '{print $2}'`

if [ -n "$process_id_synchronizer_DB" ]; then
    echo "server_synchronizer_DB - PID:$process_id_synchronizer_DB - running"
    mems=(`cat /proc/${process_id_synchronizer_DB}/statm | awk '{print $2 " " $3}'`) 
    echo  "Mem Res KB ->" $((${mems[0]} * $page_size / 1024 ))
    echo  "Mem Sha KB ->" $((${mems[1]} * $page_size / 1024 ))	
else
    echo "server_synchronizer_DB NOT running"
fi

# server_ccs_dashboard_backend.js

echo "monitoring server_ccs_dashboard_backend"

process_id_dashboard_backend=`/bin/ps -fe | grep "server_ccs_dashboard_backend.js" | grep -v "grep" | grep -v "mate-terminal" | awk '{print $2}'`

if [ -n "$process_id_dashboard_backend" ]; then
    echo "server_dashboard_backend - PID:$process_id_dashboard_backend - running"
    mems=(`cat /proc/${process_id_dashboard_backend}/statm | awk '{print $2 " " $3}'`) 
    echo  "Mem Res KB ->" $((${mems[0]} * $page_size / 1024 ))
    echo  "Mem Sha KB ->" $((${mems[1]} * $page_size / 1024 ))		
else
    echo "server_dashboard_backend NOT running"
fi









