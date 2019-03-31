#!/usr/bin/env python3
"""
Boxifies images when they are uploaded. Is stored as __doc__
"""


import argparse
import sys
import os
import glob
from pdf2image import convert_from_path
from PIL import Image, ImageDraw
import json


def convert_to_image(pdf):
    """Converts a pdf file to image
    Args:
        pdf (str): file path.

    Returns:
        str: saved image name
    """
    pages = convert_from_path(pdf, 90)
    save_name = pdf.split('.')[0]
    for page in pages:
        page.save(f'{save_name}.jpg', 'JPEG')
    return save_name


def draw_boxes(image_name, json_file):
    """Converts a pdf file to image
    Args:
        image_name (str): file path to image.
        json_file (str): file path to json_file
    Returns:
        bool: True when done
    """

    with open(os.path.join(json_file), 'r') as ocr_json:
        json_info = json.load(ocr_json)

    acceptable_categories = [
        "PRO #", "Consignee Zip", "Trailer Nbr"]

    print(json_info)
    bounding_boxes = [x['bounds'] for x in json_info['documents']
                      [0]['results'][0]['data'] if x['name'] in acceptable_categories]
    # bounding_boxes = list(filter(
    #     lambda x: x['name'] == "COD Amount", json_info['documents'][0]['results'][0]['data']))

    # bounding_boxes = list(map(lambda x: x['bounds'],))
    print(bounding_boxes)
    im = Image.open(os.path.join(f'{image_name}.jpg'))
    draw = ImageDraw.Draw(im)

    for box in bounding_boxes:
        print(box)
        adjustment_x = 0*(box[2]-box[0])/3.5
        adjustment_y = 0*(box[3]-box[1])/2

        top_left = (adjustment_x + box[0], adjustment_y+box[1])
        bottom_left = (adjustment_x + box[0], adjustment_y+box[3])
        top_right = (adjustment_x + box[2], adjustment_y+box[1])
        bottom_right = (adjustment_x + box[2], adjustment_y + box[3])
        # box
        draw.line((top_left, bottom_left), fill=(255, 0, 0, 125), width=5)
        draw.line((top_right, bottom_right), fill=(255, 0, 0, 125), width=5)
        draw.line((top_left, top_right), fill=(255, 0, 0, 125), width=5)
        draw.line((bottom_left, bottom_right), fill=(255, 0, 0, 125), width=5)
        # Cross
        draw.line((bottom_left, top_right), fill=(255, 0, 0, 125), width=5)
        draw.line((bottom_right, top_left), fill=(255, 0, 0, 125), width=5)

    del draw
    im.save(f'{image_name}.jpg', "JPEG")
    print(f'Saved {image_name}.jpg')


def check_for_new_files(existing_file_pairs):
    """Example function with types documented in the docstring.
    Args:
        existing_file_pairs (list(string)): file names json/pdf pairs in
        current directory.
    Returns:
        bool: If new file found, returns true.
    """
    all_pdfs = {pdf for pdf in glob.glob("documents/*.pdf")}
    all_jsons = {json_file for json_file in glob.glob("documents/*.json")}
    all_file_pairs = set()

    for pdf in all_pdfs:
        for json_file in all_jsons:
            if pdf.split('.')[0].startswith(json_file.split('.')[0]):
                all_file_pairs.add((pdf, json_file))

    return {*all_file_pairs} ^ {*existing_file_pairs}


def main():
    print("Listening...")
    existing_file_pairs = set()
    while True:
        new_files_pairs = check_for_new_files(existing_file_pairs)
        if new_files_pairs:
            print("New upload detected", new_files_pairs)
            for new_file_pdf, new_file_json in new_files_pairs:
                output_image = convert_to_image(new_file_pdf)
                draw_boxes(output_image, new_file_json)
                existing_file_pairs.add((new_file_pdf, new_file_json))


if __name__ == "__main__":
    main()
