from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
from bunjang import extract  
from bunjang_ETL_Postgres import etl
from datetime import datetime, timedelta
from plugins import slack
import pytz

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2023, 6, 27, 0, 0, 0),
    # 'retries': 1,
    'on_failure_callback': slack.on_failure_callback,
}

# DAG 설정
dag = DAG(
    dag_id = 'bunjang_ETL',
    default_args=default_args,
    schedule_interval='@daily'
)

# 크롤링 작업 설정
extract_task = PythonOperator(
    task_id='extract_task',
    python_callable=extract,
    dag=dag,
)

# ETL 전처리 작업 설정
etl_task = PythonOperator(
    task_id='etl_task',
    python_callable=etl, 
    provide_context=True,
    dag=dag,
)

# 작업 순서 설정: 크롤링 후 TL 전처리
extract_task >> etl_task