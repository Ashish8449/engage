import sys
import json
import cv2
import numpy as np
import face_recognition
import os
import os.path


def func(q):
    return json.dumps({'value': q})


def face_recog(abc):
    rows = abc['rows']

    if (len(rows) == 0):
        ans = {'type': "face_recog", 'image_id': -1}
        json_data = json.dumps(ans)
        print(json_data)
    else:

        images = []
        image_id = []

        for row in rows:
            file_exists = os.path.exists(row['path'])
            if (file_exists):
                curImg = cv2.imread(row['path'])
                images.append(curImg)
                image_id.append(row['image_id'])
            else:
                ans = {'type': "face_recog", 'image_id': -1}
                json_data = json.dumps(ans)
                print(json_data)
        if (len(images) > 0):
            imgTest = face_recognition.load_image_file(abc['path'])
            imgTest = cv2.cvtColor(imgTest, cv2.COLOR_BGR2RGB)
            faceLocTest = face_recognition.face_locations(imgTest)[0]
            encodeTest = face_recognition.face_encodings(imgTest)[0]

            def findEncodings(images):
                encodeList = []
                for img in images:
                    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                    encode = face_recognition.face_encodings(img)[0]
                    encodeList.append(encode)
                return encodeList
            encodeListKnown = findEncodings(images)
            matches = face_recognition.compare_faces(
                encodeListKnown, encodeTest)
            faceDis = face_recognition.face_distance(
                encodeListKnown, encodeTest)

            matchIndex = np.argmin(faceDis)
            ans = {'type': "face_recog", 'image_id': -1}
            if matches[matchIndex]:
                ans['image_id'] = image_id[matchIndex]
            json_data = json.dumps(ans)
            print(json_data)
        else:
            ans = {'type': "face_recog", 'image_id': -1}

            json_data = json.dumps(ans)
            print(json_data)


while True:
    inp = input(" ")
    abc = json.loads(inp)
    file_exists = os.path.exists(abc['path'])
    if (file_exists):
        if(abc['type'] == "face_recog"):
            face_recog(abc)
    else:
        ans = {'type': "face_recog", 'image_id': -1}
        json_data = json.dumps(ans)
        print(json_data)
