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
from reportlab.platypus import (
    Image as RLImage,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


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
        "Title": ParagraphStyle(
            "Title",
            parent=base_styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            textColor=colors.HexColor("#8E3B12"),
            alignment=TA_LEFT,
            spaceAfter=6,
        ),
        "Heading": ParagraphStyle(
            "Heading",
            parent=base_styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=14,
            textColor=colors.HexColor("#1F2937"),
            spaceAfter=8,
        ),
        "SectionTitle": ParagraphStyle(
            "SectionTitle",
            parent=base_styles["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=12,
            textColor=colors.HexColor("#8E3B12"),
            spaceAfter=6,
        ),
        "Body": ParagraphStyle(
            "Body",
            parent=base_styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor("#111827"),
        ),
        "Footer": ParagraphStyle(
            "Footer",
            parent=base_styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.5,
            textColor=colors.HexColor("#4B5563"),
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

    elements.append(Paragraph(data.get("project_name", "RustDetector"), styles["Title"]))
    elements.append(Paragraph(data.get("report_title", "Corrosion Detection Report"), styles["Heading"]))

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
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F3E8E2")),
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#111827")),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#D6D3D1")),
                ("PADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    elements.append(metadata_table)
    elements.append(Spacer(1, 14))

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
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F9FAFB")),
                    ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#D1D5DB")),
                    ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("PADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )
        elements.append(Paragraph(f"Image {index}: {image.get('filename', 'Unnamed file')}", styles["Body"]))
        elements.append(image_table)
        elements.append(Spacer(1, 10))

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
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#FFF7ED")),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#D6D3D1")),
                ("PADDING", (0, 0), (-1, -1), 6),
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
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#8E3B12")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                    ("FONTSIZE", (0, 0), (-1, -1), 7.5),
                    ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D1D5DB")),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAFAF9")]),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("ALIGN", (0, 0), (0, -1), "CENTER"),
                    ("ALIGN", (2, 0), (2, -1), "CENTER"),
                    ("PADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )
        elements.append(detail_table)
    elements.append(Spacer(1, 12))

    elements.append(_section_title("Risk Assessment", styles))
    elements.append(Paragraph(risk_assessment, styles["Body"]))
    elements.append(Spacer(1, 10))

    elements.append(_section_title("Recommendations", styles))
    recommendation_lines = "<br/>".join(f"- {item}" for item in recommendations)
    elements.append(Paragraph(recommendation_lines, styles["Body"]))
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
