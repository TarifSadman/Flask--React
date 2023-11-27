from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Update the database URI if needed
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)
class FormData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    blood_group = db.Column(db.String(50))
    email = db.Column(db.String(50))
    message = db.Column(db.Text)
    updated_at = db.Column(db.DateTime, nullable=True)

# Route to add data
@app.route('/api/add_data', methods=['POST'])
def add_data():
    data = request.get_json()
    
    new_data = FormData(name=data['name'], email=data['email'], message=data['message'], updated_at=datetime.utcnow(), blood_group=data['blood_group'])

    db.session.add(new_data)
    db.session.commit()

    return jsonify({'message': 'Data stored successfully'})

# Route to get data list
@app.route('/api/get_stored_data', methods=['GET'])
def get_stored_data():
    stored_data = FormData.query.all()

    data_list = []
    for data in stored_data:
        data_dict = {
            'id': data.id,
            'name': data.name,
            'email': data.email,
            'message': data.message,
            'blood_group': data.blood_group
        }

        if data.updated_at is not None:
            data_dict['updated_at'] = data.updated_at.strftime('%Y-%m-%d %H:%M:%S')

        data_list.append(data_dict)

    return jsonify({'data': data_list})

# Route to edit data
@app.route('/api/edit_data/<int:id>', methods=['PUT'])
def edit_data(id):
    data = request.get_json()
    
    edited_data = FormData.query.get(id)

    if edited_data:
        edited_data.name = data['name']
        edited_data.email = data['email']
        edited_data.message = data['message']
        edited_data.blood_group = data['blood_group']
        edited_data.updated_at = datetime.utcnow()

        db.session.commit()

        response_data = {
            'id': edited_data.id,
            'name': edited_data.name,
            'email': edited_data.email,
            'message': edited_data.message,
            'blood_group': edited_data.blood_group,
            'updated_at': edited_data.updated_at.strftime('%Y-%m-%d %H:%M:%S') if edited_data.updated_at else None
        }

        return jsonify({'message': 'Data updated successfully', 'data': response_data})
    else:
        return jsonify({'message': 'Data not found'}), 404

# Route to delete data
@app.route('/api/delete_data/<int:id>', methods=['DELETE'])
def delete_data(id):
    data_to_delete = FormData.query.get(id)

    if data_to_delete:
        db.session.delete(data_to_delete)
        db.session.commit()

        return jsonify({'message': 'Data deleted successfully'})
    else:
        return jsonify({'message': 'Data not found'}), 404

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()
        db.create_all()
        app.run(debug=True)
