import sys
import tabula

def convert_pdf_to_csv(pdf_path, output_path):
    tabula.convert_into(pdf_path, output_path, pages="all", output_format="csv", stream=True)

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    output_path = sys.argv[2]
    convert_pdf_to_csv(pdf_path, output_path)
