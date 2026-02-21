FROM python:alpine3.19

WORKDIR /app

COPY requirements.txt .

RUN python -V
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

CMD [ "python", "/app/main.py" ]