from flask import Flask, request
from pymongo import MongoClient
from openai import OpenAI

app = Flask(__name__)

# MongoDB 연결
client = MongoClient('')
db = client.my_database
collection = db.summary_script

# API 키
client = OpenAI()

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
            {"role": "assistant", "content": "Please summarize that conservation in bullet form in Korean according to the context"}
        ])
    
        #결과 저장
        summary = response.choices[0].message.content
        summaries.append(summary)

    # 결합
    full_summary = ' '.join(summaries)
    return full_summary

# DB에 content insert
'''
collection.insert_one({
    "_id": 2,
    "content": """
A: 안녕하세요, 여러분. 오늘은 졸업작품 주제에 대해 이야기해보려고 합니다. 아이디어가 있나요?

B: 저는 최근에 인공지능이 많이 발전하고 있어서, 이를 활용한 프로젝트를 생각해봤습니다. 예를 들어, 이미지 인식을 통해 식물의 종류를 판별하는 애플리케이션을 만들어보는 건 어떨까요?

C: 그게 좋은 아이디어인 것 같아요. 하지만 이미 비슷한 애플리케이션이 많이 있어서, 우리가 만들면서 차별화를 가져갈 수 있을까요?

A: 그렇군요, 그럼 차별화를 위해 어떤 기능을 추가할 수 있을까요?

B: 식물의 종류를 판별하는 것뿐만 아니라, 그 식물이 필요로 하는 햇빛, 물, 영양분 등의 정보도 제공하는 건 어떨까요?

C: 그게 좋을 것 같아요. 사용자가 식물을 잘 관리할 수 있도록 도와주는 기능이 있으면 좋겠네요.

A: 좋아요, 그럼 이 아이디어로 가보죠. 다음 회의에서는 이 아이디어를 바탕으로 구체적인 계획을 세워보도록 합시다.

B: 네, 알겠습니다. 그럼 다음 회의에서 뵙겠습니다.

A: 그럼 다음주 금요일 1시에 시간 괜찮으신가요?

C: 아 죄송하지만 시간이 안 될 것같습니다. 오후 9시는 어떤가요?

B: 저는 괜찮습니다.

A; 그럼 다음주 금요일 오후 9시에 만나요.

C: 네, 그럼 그때 봐요.
"""
})
'''

if __name__ == '__main__':
    app.run(debug=True)