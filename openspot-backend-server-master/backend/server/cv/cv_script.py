import os
import numpy as np
import random
import cv2
import skimage.io
import matplotlib
import matplotlib.pyplot as plt
import mrcnn.config
from mrcnn import utils, visualize
from mrcnn.model import MaskRCNN
from pathlib import Path
from django.core.files.storage import FileSystemStorage
from cv.models import Module

# COCO Class names
# Index of the class in the list is its ID. For example, to get ID of
# the person class, use: class_names.index('person')
# class_names = ['BG', 'person', 'bicycle', 'car', 'motorcycle', 'airplane',
#             'bus', 'train', 'truck', 'boat', 'traffic light',
#             'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird',
#             'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear',
#             'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie',
#             'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
#             'kite', 'baseball bat', 'baseball glove', 'skateboard',
#             'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup',
#             'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
#             'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza',
#             'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed',
#             'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote',
#             'keyboard', 'cell phone', 'microwave', 'oven', 'toaster',
#             'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors',
#             'teddy bear', 'hair drier', 'toothbrush']

#  Configuration that will be used by Mask R-CNN library
class MaskRCNNConfig(mrcnn.config.Config):
    NAME = "coco_pretrained_model_config"
    IMAGES_PER_GPU = 1
    GPU_COUNT = 1
    NUM_CLASSES = 1 + 80  # COCO dataset has 80 classes + one background class
    DETECTION_MIN_CONFIDENCE = 0.6
    
# Filter the result of Mask R-CNN to only obtain bounding boxes and class names of objects identified as cars
def getCarBoxes(boxes,class_ids):
    car_boxes = []
    
    # class_id 3/4/6/8 corresponds to car/motorcycle/bus/truck objects as per COCO dataset
    for i, box in enumerate(boxes):
        if class_ids[i] in [3,4,6,8]:
            car_boxes.append(box)

    return np.array(car_boxes)

def detect(upImage_file, module, refSpots):
    # Root directory of the project
    ROOT_DIR = "."
    MODEL_DIR = os.path.join(ROOT_DIR,"cv/logs")

    # Path for saving trained weights file
    COCO_MODEL_PATH = os.path.join(ROOT_DIR,"cv/mask_rcnn_coco.h5")

    # Create a Mask R-CNN model in inference mode
    model = MaskRCNN(mode='inference', config=MaskRCNNConfig(), model_dir=MODEL_DIR)

    model.load_weights(COCO_MODEL_PATH,by_name=True)
    # model.load_weights("/Users/CurtisLui/repos/openspot-backend-server/backend/server/cv/mask_rcnn_coco.h5", by_name=True)

    # load parking space information
    spots = []
    for i in range(len(refSpots)):
        spots.append(refSpots[i].getBBox())
    parking_spaces = np.array(spots)
    
    # perform detection
    upImage = skimage.io.imread(upImage_file)
    resUpImage = model.detect([upImage])
    r2 = resUpImage[0]
    detectedCarBoxes = getCarBoxes(r2['rois'],r2['class_ids'])

    # NOTE: Ask team if this is needed
    # # computinig center locations of each spot
    # center_locs = []
    # for spot_coords in parking_spaces:
    #     center_locs.append([int((spot_coords[1]+spot_coords[3])/2), int((spot_coords[0]+spot_coords[2])/2)])
    # centers = np.array(center_locs)

    # computer overlap of the bounding boxes
    # print("detected car boxes size: %d" , len(detectedCarBoxes))

    if (len(detectedCarBoxes) > 0 and len(parking_spaces) > 0):
        print('finding overlap')
        overlaps = mrcnn.utils.compute_overlaps(detectedCarBoxes, parking_spaces)
        overlap_prob = overlaps.sum(axis=0)
        # NOTE: For debugging purposes, drawing detected bounding boxes for uploaded Image
        predUpImage = skimage.io.imread(upImage_file)
        # Draw each box on the frame
        for i,box in enumerate(detectedCarBoxes):
            y1, x1, y2, x2 = box
            cv2.rectangle(predUpImage, (x1, y1), (x2, y2),(0,0,255),10)
        skimage.io.imsave('media/result/cv/predUpImage.jpg', predUpImage)
            
        for i,box in enumerate(parking_spaces):
            y1, x1, y2, x2 = box
            
            if overlap_prob[i] >= 0.2:
                occupancy_status = (255,0,0)
                refSpots[i].updateOccupied(True)
            else:
                occupancy_status = (0,255,0)
                refSpots[i].updateOccupied(False)

            cv2.rectangle(upImage,(x1,y1), (x2,y2), occupancy_status ,10)    
            # cv2.circle(upImage,(centers[i][0],centers[i][1]),10,occupancy_status,10) # FIXME: Ask team if this is needed
        
        # save result of resulting image
        skimage.io.imsave('media/result/cv/res.jpg', upImage)
    else:
        print(len(detectedCarBoxes))
        print('no cars detected ')
        # if no cars in photo, then all spots are empty
        for i,box in enumerate(parking_spaces):
            y1, x1, y2, x2 = box
            occupancy_status = (0,255,0)
            refSpots[i].updateOccupied(False)

            cv2.rectangle(upImage,(x1,y1), (x2,y2), occupancy_status ,10) 

    return refSpots
