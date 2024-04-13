from openai import OpenAI

# API 키
client = OpenAI()

# 분할
def summarize_script(file_path):
    # 파일 읽어오기
    with open(file_path, 'r', encoding='utf-8') as file:
        script = file.read()

    #스크립트 1000자씩 분리
    parts = [script[i:i+1000] for i in range(0, len(script), 1000)]
    summaries = []

    for part in parts:
        response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": script},
            {"role": "assistant", "content": "Please summarize that conservation in bullet form in Korean"}
        ])
    
        #결과 저장
        summary = response.choices[0].message.content
        summaries.append(summary)

    # 결합
    full_summary = ' '.join(summaries)
    return full_summary

# 추후 DB에서 가져오도록 수정
# 뉴스기사로 테스트
file_path = "news.txt"

summary = summarize_script(file_path)
print(summary)