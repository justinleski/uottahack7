from flask import Flask, request, jsonify, Response
from transformers import AutoTokenizer, AutoModel
import torch
import struct

app = Flask(__name__)

# Load bilingual embedding model
MODEL_NAME = "sentence-transformers/distiluse-base-multilingual-cased-v2"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)

@app.route("/embed", methods=["POST"])
def embed():
    if request.content_type != 'text/plain':
        return jsonify({"error": "Unsupported content type"}), 400

    query = request.data.decode("utf-8")
    if not query:
        return jsonify({"error": "Empty query"}), 400

    inputs = tokenizer(query, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        embeddings = model(**inputs).last_hidden_state.mean(dim=1).squeeze(0)

    # Convert tensor to a list of floats
    embedding_list = embeddings.tolist()

    # Pack the list of floats as binary (IEEE 754 32-bit floats)
    binary_data = struct.pack(f"{len(embedding_list)}f", *embedding_list)

    return Response(binary_data, content_type="application/octet-stream")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=3010)