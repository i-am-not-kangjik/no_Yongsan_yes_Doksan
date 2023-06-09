import React from "react"

function Dashboard() {

    // 백엔드에서 받아온 placeId 삽입
    const dashboardUrl = `http://13.209.228.199:8088/superset/dashboard/2/?placeid=${1}&standalone=2&show_filters=0&expand_filters=0`;

    return (
        <div style={{ width: '100%', height: '100%', overflowX: 'auto', marginBottom : '50px' }}>
        <h3>Report</h3>
        <iframe
            title="Dashboard"
            src={dashboardUrl}
            width='80%'
            height="2115px"
            sandbox="allow-same-origin allow-scripts"
            onClick={(e) => e.preventDefault()} // 클릭 이벤트를 무시합니다.
        ></iframe>
        </div>
    )
}

export default Dashboard;
