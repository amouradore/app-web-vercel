from flask import Flask, jsonify
import xml.etree.ElementTree as ET

app = Flask(__name__)


if __name__ == '__main__':
    app.run(debug=True)
