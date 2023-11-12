from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define the data model
class FormData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(50))
    message = db.Column(db.Text)

@app.route('/api/store_data', methods=['POST'])
def store_data():
    data = request.get_json()
    
    # Create a new FormData instance
    new_data = FormData(name=data['name'], email=data['email'], message=data['message'])

    # Add and commit the new data to the database
    db.session.add(new_data)
    db.session.commit()

    return jsonify({'message': 'Data stored successfully'})

@app.route('/api/get_stored_data', methods=['GET'])
def get_stored_data():
    # Retrieve all stored data from the database
    stored_data = FormData.query.all()

    # Convert data to a list of dictionaries
    data_list = [{'name': data.name, 'email': data.email, 'message': data.message} for data in stored_data]

    return jsonify({'data': data_list})

if __name__ == '__main__':
    with app.app_context():
        # Create tables in the database
        db.create_all()
    app.run(debug=True)

