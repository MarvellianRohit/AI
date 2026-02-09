
FROM python:3.9-slim
WORKDIR /app
COPY scratchpad/mission/auth.py auth.py
RUN pip install fastapi uvicorn sqlalchemy pydantic passlib[argon2] python-jose[cryptography] PyYAML
CMD ["python", "auth.py"]
