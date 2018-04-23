from flask import Flask, jsonify, request

app = Flask(__name__)


test_response = "Hello World"

@app.route('/')
def get_incomes():
	return test_response

@app.route('/', methods=['POST'])
def add_income():
	incomes.append(request.get_json())
	return '', 204

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
