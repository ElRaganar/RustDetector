from base64 import b64decode
from datetime import datetime
from io import BytesIO
from os import makedirs
from os.path import dirname, isdir
from zoneinfo import ZoneInfo

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Image as RLImage, KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def _decode_data_uri(data_uri: str):
    if not data_uri or not data_uri.startswith("data:image"):
        return None
    _, encoded = data_uri.split(",", 1)
    return BytesIO(b64decode(encoded))

def severity_from_corrosion_count(count: int) -> str:
    if count >= 5:
        return "High"
    if count >= 3:
        return "Medium"
    if count >= 1:
        return "Low"
    return "None"


def risk_assessment_from_severity(severity: str, corrosion_count: int) -> str:
    if severity == "High":
        return "High corrosion detected. Immediate inspection required."
    if severity == "Medium":
        return "Moderate corrosion detected. Preventive maintenance recommended."
    if severity == "Low":
        return "Low corrosion detected. Early treatment is recommended to prevent spread."
    return "No visible corrosion detected. Continue routine monitoring."


def recommendations_from_severity(severity: str):
    if severity == "High":
        return [
            "Isolate and inspect affected components immediately.",
            "Remove corrosion and apply anti-corrosion coating.",
            "Schedule urgent maintenance verification by a qualified inspector.",
        ]
    if severity == "Medium":
        return [
            "Clean affected areas and remove visible corrosion.",
            "Apply anti-corrosion coating to exposed surfaces.",
            "Schedule preventive maintenance inspection in the next service window.",
        ]
    if severity == "Low":
        return [
            "Clean affected areas and document the current condition.",
            "Apply protective coating where needed.",
            "Monitor the site in the next routine inspection cycle.",
        ]
    return [
        "Maintain routine inspection intervals.",
        "Keep surfaces clean and dry where possible.",
        "Retain this report for traceability and future comparison.",
    ]


def _fit_image(image_data: str, max_width=3.1 * inch, max_height=2.3 * inch):
    image_stream = _decode_data_uri(image_data)
    if image_stream is None:
        return None

    image = RLImage(image_stream)
    width = float(image.imageWidth)
    height = float(image.imageHeight)
    if width <= 0 or height <= 0:
        return None

    scale = min(max_width / width, max_height / height, 1.0)
    image.drawWidth = width * scale
    image.drawHeight = height * scale
    return image

def _section_title(text: str, styles):
    return Paragraph(text, styles["SectionTitle"])


def _table_cell(text, styles):
    return Paragraph(str(text), styles["Body"])


INDIA_TZ = ZoneInfo("Asia/Kolkata")
BRAND = colors.HexColor("#8E3B12")
BRAND_DARK = colors.HexColor("#5F2A0C")
INK = colors.HexColor("#111827")
MUTED = colors.HexColor("#6B7280")
PANEL = colors.HexColor("#FCFAF8")
PANEL_ALT = colors.HexColor("#F6F1EC")
LINE = colors.HexColor("#E7DDD6")


def _severity_color(severity: str):
    if severity == "High":
        return colors.HexColor("#B42318")
    if severity == "Medium":
        return colors.HexColor("#D97706")
    if severity == "Low":
        return colors.HexColor("#15803D")
    return colors.HexColor("#475467")


def _format_scan_time_for_india(value: str) -> str:
    if not value:
        return "N/A"

    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return value

    if parsed.tzinfo is None:
        return value

    india_time = parsed.astimezone(INDIA_TZ)
    return india_time.strftime("%d %b %Y, %I:%M:%S %p IST")


def generate_session_report(data, output_path="report.pdf"):
    output_dir = dirname(output_path)
    if output_dir and not isdir(output_dir):
        makedirs(output_dir, exist_ok=True)

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=28,
        leftMargin=28,
        topMargin=28,
        bottomMargin=28,
    )
    base_styles = getSampleStyleSheet()
    styles = {
        "Eyebrow": ParagraphStyle(
            "Eyebrow",
            parent=base_styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=10,
            textColor=BRAND,
            spaceAfter=4,
        ),
        "Title": ParagraphStyle(
            "Title",
            parent=base_styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=27,
            textColor=BRAND_DARK,
            alignment=TA_LEFT,
            spaceAfter=2,
        ),
        "Heading": ParagraphStyle(
            "Heading",
            parent=base_styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11.5,
            leading=15,
            textColor=MUTED,
            spaceAfter=10,
        ),
        "SectionTitle": ParagraphStyle(
            "SectionTitle",
            parent=base_styles["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=12.5,
            leading=15,
            textColor=BRAND_DARK,
            spaceAfter=8,
        ),
        "Body": ParagraphStyle(
            "Body",
            parent=base_styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13.5,
            textColor=INK,
        ),
        "MetricLabel": ParagraphStyle(
            "MetricLabel",
            parent=base_styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8.3,
            leading=10,
            textColor=MUTED,
            alignment=TA_LEFT,
        ),
        "MetricValue": ParagraphStyle(
            "MetricValue",
            parent=base_styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=18,
            textColor=INK,
        ),
        "Footer": ParagraphStyle(
            "Footer",
            parent=base_styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.5,
            textColor=MUTED,
            leading=11,
        ),
    }

    elements = []
    severity = data.get("severity") or severity_from_corrosion_count(int(data.get("total_corrosion", 0)))
    risk_assessment = data.get("risk_assessment") or risk_assessment_from_severity(
        severity,
        int(data.get("total_corrosion", 0)),
    )
    recommendations = recommendations_from_severity(severity)
    severity_color = _severity_color(severity)

    header_table = Table(
        [[
            Paragraph(data.get("project_name", "RustDetector").upper(), styles["Eyebrow"]),
            "",
        ], [
            Paragraph(data.get("report_title", "Corrosion Detection Report"), styles["Title"]),
            Paragraph(f"<b>Severity</b><br/><font color='{severity_color}'>{severity}</font>", styles["Body"]),
        ], [
            Paragraph(
                "AI-assisted corrosion analysis with annotated detections, risk guidance, and maintenance recommendations.",
                styles["Heading"],
            ),
            Paragraph(f"<font color='{MUTED}'>Prepared for:</font><br/>{data.get('user_name', 'Corrosion Report')}", styles["Body"]),
        ]],
        colWidths=[4.95 * inch, 1.75 * inch],
        hAlign="LEFT",
    )
    header_table.setStyle(
        TableStyle(
            [
                ("SPAN", (0, 0), (1, 0)),
                ("BACKGROUND", (0, 0), (-1, -1), PANEL),
                ("BOX", (0, 0), (-1, -1), 0.8, LINE),
                ("LINEBELOW", (0, 1), (-1, 1), 0.6, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (1, 1), (1, 2), "RIGHT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    elements.append(header_table)
    elements.append(Spacer(1, 14))

    metadata_rows = [
        ["Date & Time of Scan", _format_scan_time_for_india(data.get("scan_time", "N/A"))],
        ["Scan ID", data.get("scan_id", "N/A")],
        ["User Name", data.get("user_name", "Corrosion Report")],
        ["Severity", severity],
    ]
    metadata_table = Table(metadata_rows, colWidths=[1.8 * inch, 4.9 * inch], hAlign="LEFT")
    metadata_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F5ECE7")),
                ("BACKGROUND", (1, 0), (1, -1), colors.white),
                ("TEXTCOLOR", (0, 0), (-1, -1), INK),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                ("GRID", (0, 0), (-1, -1), 0.45, LINE),
                ("PADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    elements.append(metadata_table)
    elements.append(Spacer(1, 14))

    summary_cards = Table(
        [[
            Paragraph("Total Corrosion", styles["MetricLabel"]),
            Paragraph("Total Detections", styles["MetricLabel"]),
            Paragraph("Average Confidence", styles["MetricLabel"]),
        ], [
            Paragraph(str(data.get("total_corrosion", 0)), styles["MetricValue"]),
            Paragraph(str(data.get("total_detections", 0)), styles["MetricValue"]),
            Paragraph(f"{float(data.get('avg_confidence', 0)):.2f}%", styles["MetricValue"]),
        ]],
        colWidths=[2.22 * inch, 2.22 * inch, 2.22 * inch],
        hAlign="LEFT",
    )
    summary_cards.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PANEL),
                ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    elements.append(summary_cards)
    elements.append(Spacer(1, 16))

    elements.append(_section_title("Input Image Review", styles))
    for index, image in enumerate(data.get("images", []), start=1):
        original = _fit_image(image.get("original_image"))
        annotated = _fit_image(image.get("annotated_image"))
        image_cells = [
            [
                Paragraph("Original Uploaded Image", styles["Body"]),
                Paragraph("Annotated Detection Image", styles["Body"]),
            ]
        ]
        if original or annotated:
            image_cells.append([original or "", annotated or ""])
        else:
            image_cells.append(
                [
                    Paragraph("Original image unavailable", styles["Body"]),
                    Paragraph("Annotated image unavailable", styles["Body"]),
                ]
            )

        image_table = Table(image_cells, colWidths=[3.35 * inch, 3.35 * inch], hAlign="LEFT")
        image_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), PANEL_ALT),
                    ("BACKGROUND", (0, 1), (-1, -1), PANEL),
                    ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                    ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("TEXTCOLOR", (0, 0), (-1, 0), MUTED),
                    ("PADDING", (0, 0), (-1, -1), 7),
                ]
            )
        )
        elements.append(Paragraph(f"<b>Image {index}</b>  |  {image.get('filename', 'Unnamed file')}", styles["Body"]))
        elements.append(image_table)
        elements.append(Spacer(1, 12))

    elements.append(_section_title("Detection Summary", styles))
    summary_rows = [
        ["Total corrosion spots detected", str(data.get("total_corrosion", 0))],
        ["Total detections across all classes", str(data.get("total_detections", 0))],
        ["Average confidence", f"{float(data.get('avg_confidence', 0)):.2f}%"],
        ["Severity level", severity],
    ]
    summary_table = Table(summary_rows, colWidths=[3.6 * inch, 3.1 * inch], hAlign="LEFT")
    summary_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#FBF0E7")),
                ("BACKGROUND", (1, 0), (1, -1), PANEL),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("TEXTCOLOR", (0, 0), (-1, -1), INK),
                ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                ("GRID", (0, 0), (-1, -1), 0.45, LINE),
                ("PADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    elements.append(summary_table)
    elements.append(Spacer(1, 12))

    elements.append(_section_title("Detailed Detection Table", styles))
    detection_rows = [[
        _table_cell("Detection ID", styles),
        _table_cell("Image", styles),
        _table_cell("Confidence", styles),
        _table_cell("Bounding Box (x, y, w, h)", styles),
    ]]
    for image in data.get("images", []):
        for det in image.get("detection_items", []):
            bbox = det.get("bbox", [0, 0, 0, 0])
            detection_rows.append(
                [
                    _table_cell(det.get("id", "N/A"), styles),
                    _table_cell(image.get("filename", "N/A"), styles),
                    _table_cell(f"{float(det.get('confidence', 0)) * 100:.2f}%", styles),
                    _table_cell(
                        f"({int(bbox[0])}, {int(bbox[1])},<br/>{int(bbox[2])}, {int(bbox[3])})",
                        styles,
                    ),
                ]
            )

    if len(detection_rows) == 1:
        elements.append(Paragraph("No detections available for this scan.", styles["Body"]))
    else:
        detail_table = Table(
            detection_rows,
            colWidths=[0.95 * inch, 2.75 * inch, 0.9 * inch, 2.1 * inch],
            repeatRows=1,
            hAlign="LEFT",
        )
        detail_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), BRAND),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                    ("FONTSIZE", (0, 0), (-1, -1), 7.5),
                    ("GRID", (0, 0), (-1, -1), 0.35, LINE),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PANEL]),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("ALIGN", (0, 0), (0, -1), "CENTER"),
                    ("ALIGN", (2, 0), (2, -1), "CENTER"),
                    ("PADDING", (0, 0), (-1, -1), 5),
                ]
            )
        )
        elements.append(detail_table)
    elements.append(Spacer(1, 12))

    elements.append(_section_title("Risk Assessment", styles))
    risk_table = Table([[Paragraph(risk_assessment, styles["Body"])]], colWidths=[6.7 * inch], hAlign="LEFT")
    risk_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF7ED") if severity != "None" else PANEL),
                ("BOX", (0, 0), (-1, -1), 0.7, severity_color),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    elements.append(risk_table)
    elements.append(Spacer(1, 10))

    elements.append(_section_title("Recommendations", styles))
    recommendation_lines = "<br/>".join(f"- {item}" for item in recommendations)
    recommendation_table = Table([[Paragraph(recommendation_lines, styles["Body"])]], colWidths=[6.7 * inch], hAlign="LEFT")
    recommendation_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PANEL),
                ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    elements.append(recommendation_table)
    elements.append(Spacer(1, 14))

    footer_block = KeepTogether(
        [
            Paragraph("Generated by RustDetector AI System", styles["Footer"]),
            Spacer(1, 2),
            Paragraph(
                "Disclaimer: This is an AI-generated report and should be verified by professionals.",
                styles["Footer"],
            ),
        ]
    )
    elements.append(footer_block)

    doc.build(elements)
    return output_path
