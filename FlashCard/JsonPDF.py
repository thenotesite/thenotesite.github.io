import json
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, LongTable, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

# ------------------------
# Custom Canvas class for PDF metadata
# ------------------------
class MyCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def save(self):
        self.setTitle("Vocabulary")
        self.setAuthor("Mandip")
        self.setSubject("English")
        self.setCreator("Mandip")
        super().save()

# ------------------------
# Function to add page numbers + footer
# ------------------------
def add_page_number(canvas, doc):
    page_num = canvas.getPageNumber() - 1  # skip title page
    width, height = A4

    if page_num > 0:
        # Page number (bottom-right)
        canvas.setFont("Helvetica", 10)
        text = f"# {page_num}"
        canvas.drawRightString(width - 30, 20, text)

        # Footer (center)
        canvas.setFont("Courier", 9)
        canvas.drawCentredString(width / 2, 20, "© MANDIP")


# ------------------------
# Load JSON file
# ------------------------
with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# ------------------------
# PDF setup
# ------------------------
pdf_file = "vocabulary.pdf"
doc = SimpleDocTemplate(pdf_file, pagesize=A4,
                        leftMargin=40, rightMargin=40, topMargin=50, bottomMargin=50)
elements = []

# ------------------------
# Styles
# ------------------------
styles = getSampleStyleSheet()

title_style = ParagraphStyle("title", parent=styles["Title"],
                             fontSize=24, leading=28, alignment=1, spaceAfter=20)

subtitle_style = ParagraphStyle("subtitle", parent=styles["Normal"],
                                fontSize=14, leading=18, alignment=1, textColor=colors.grey)

# Body text → Courier (normal)
normal_style = ParagraphStyle("normal_wrap", parent=styles["Normal"],
                              fontName="Courier", fontSize=10,
                              leading=14, alignment=0)

# Word column → Courier-Bold
word_style = ParagraphStyle("word_wrap", parent=styles["Normal"],
                            fontName="Courier-Bold", fontSize=10,
                            leading=14, alignment=0)

# Header text → Times-Roman
header_style = ParagraphStyle("header", parent=styles["Normal"],
                              fontName="Times-Roman", fontSize=14,
                              leading=16, alignment=0,
                              textColor=colors.white)

# ------------------------
# Title Page with dynamic date
# ------------------------
today = datetime.today().strftime("%B %d, %Y")
elements.append(Spacer(1, 200))
elements.append(Paragraph("VOCABULARY LIST", title_style))
elements.append(Paragraph(f"Created by Mandip – {today}", subtitle_style))
elements.append(PageBreak())

# ------------------------
# Table Header
# ------------------------
table_data = [[Paragraph("<b>WORD</b>", header_style),
               Paragraph("<b>MEANING</b>", header_style),
               Paragraph("<b>EXAMPLE</b>", header_style)]]

# ------------------------
# Table Rows
# ------------------------
for entry in data:
    word = Paragraph(entry['title'], word_style)
    details = Paragraph(entry['details'].replace("\n", "<br/>"), normal_style)
    examples = Paragraph(entry['examples'].replace("\n", "<br/>"), normal_style)
    table_data.append([word, details, examples])

# ------------------------
# Table setup
# ------------------------
table = LongTable(table_data, colWidths=[120, 200, None], repeatRows=1)

table_style = TableStyle([
    # Header style
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#cc0066")),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#ffffff")),
    ("ALIGN", (0, 0), (-1, -1), "LEFT"),     
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("FONTSIZE", (0, 0), (-1, 0), 14),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),

    # Borders
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#000000")),
])

# Alternate row colors (white / #f1f1f1)
for i in range(1, len(table_data)):
    bg_color = colors.white if i % 2 == 0 else colors.HexColor("#FAFAFA")
    table_style.add("BACKGROUND", (0, i), (-1, i), bg_color)

table.setStyle(table_style)
elements.append(table)

# ------------------------
# Build PDF
# ------------------------
doc.build(elements, onFirstPage=add_page_number, onLaterPages=add_page_number, canvasmaker=MyCanvas)

print(f"PDF created successfully - {pdf_file}")
