from flask import Flask, request, jsonify, render_template, send_file
from pymongo import MongoClient
from openai import OpenAI
from pdfkit.configuration import Configuration
import datetime
import pdfkit

app = Flask(__name__)

# MongoDB 연결
client = MongoClient('')
db = client.my_database
collection = db.summary_script

# API 키
client = OpenAI(
    api_key=""
)

@app.route('/summarize')
def summarize_show():
    return render_template('summary.html')


# 분할
@app.route('/summarize', methods=['POST'])
def summarize_script():
    document_id = request.json['document_id']

    # MongoDB에서 문서 가져오기
    document = collection.find_one({'_id': document_id})
    script = document['content']

    #스크립트 1000자씩 분리
    parts = [script[i:i+1000] for i in range(0, len(script), 1000)]
    summaries = []

    for part in parts:
        response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": script},
            {"role": "assistant", 
             "content": "1. I want a summary of the meeting\
                         2. The summary result should be bullet form\
                         3. You have to write it in Korean\
                         4. The summary results should be in chronological order"}
        ])
    
        #결과 저장
        summary = response.choices[0].message.content
        summaries.append(summary)

    # 결합
    full_summary = ' '.join(summaries)

    # 전체주제
    topic_response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": full_summary},
            {"role": "assistant", 
             "content": "1. Please create a topic that penetrates the contents of the meeting\
                         2. The generated topic must be one simple sentence\
                         3. Please write it in Korean\
                         4. Don't use the high expression"}
        ]
    )

    topic = topic_response.choices[0].message.content

    #현재날짜
    current_date = datetime.datetime.now().strftime('%Y-%m-%d')

    return jsonify({
        "full_summary" : full_summary,
        "current_date" : current_date,
        "topic_response" : topic,
    })

# wkhtmltopdf 경로 설정
config = pdfkit.configuration(
    wkhtmltopdf = "C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe"
    )

# pdf 다운로드
@app.route('/download', methods=['POST'])
def export_pdf():
    data = request.json
    html_content = data['html']

    # html -> pdf
    pdf = pdfkit.from_string(html_content, False, configuration=config)

    # pdf 임시 저장
    pdf_filename = 'output.pdf'
    with open(pdf_filename, 'wb') as f:
        f.write(pdf)

    # PDF를 클라이언트에 전송
    return send_file(pdf_filename, as_attachment=True)




# DB에 content insert
'''
with open("KakaoTalk_20240429_1436_45_269_group.txt", "r", encoding="utf-8") as file:
    file_content = file.read()

collection.insert_one({
    "_id": 1,
    "content": file_content
})
'''

if __name__ == '__main__':
    app.run(debug=True, port=5000)