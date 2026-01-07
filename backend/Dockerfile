FROM python:3.11-slim

WORKDIR /app

COPY ./app /app

RUN pip install --no-cache-dir -r /app/requirements.txt || true

CMD ["python", "main.py"]
