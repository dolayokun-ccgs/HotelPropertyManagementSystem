import json
import logging
import re
from typing import Any


# ============================================================
# CLEANING FUNCTIONS
# ============================================================

def clean_name(value: str) -> str:
    """
    Allow:
      - letters
      - spaces
      - apostrophes
      - hyphens

    Examples:
      O'Connor
      Robert-Florinel
    """
    value = value.strip()

    return re.sub(
        r"[^A-Za-z\s'\-]",
        "",
        value
    )


def clean_email(value: str) -> str:
    return value.strip().lower()


def clean_phone(value: str) -> str:
    """
    Keep digits only.

    Example:
      (07393) 584-791
      -> 07393584791
    """
    return re.sub(
        r"[^0-9]",
        "",
        value
    )


def clean_ni_number(value: str) -> str:
    """
    Example:
      SR 857550 C
      -> SR857550C
    """
    value = re.sub(
        r"[^A-Za-z0-9]",
        "",
        value
    )

    return value.upper()


def clean_postcode(value: str) -> str:
    """
    Example:
      da12-5bs
      -> DA12 5BS
    """

    value = re.sub(
        r"[^A-Za-z0-9]",
        "",
        value
    ).upper()

    if len(value) > 3:
        value = f"{value[:-3]} {value[-3:]}"

    return value


def clean_address(value: str) -> str:
    """
    Preserve common address punctuation.

    Examples:
      Flat 2/3 King's Court
      17, Silkfield Road
    """

    return re.sub(
        r"[^\w\s,\-'/]",
        "",
        value.strip()
    )


def clean_position(value: str) -> str:
    """
    Example:
      JT/0608
      -> JT0608
    """

    return re.sub(
        r"[^A-Za-z0-9]",
        "",
        value.strip()
    )


def clean_job_title(value: str) -> str:
    """
    Preserve:
      &
      /
      -
    """

    return re.sub(
        r"[^A-Za-z0-9\s&\-/]",
        "",
        value.strip()
    )


def clean_project_reference(value: str) -> str:
    """
    Preserve:
      .
      -
      spaces
    """

    return re.sub(
        r"[^A-Za-z0-9.\-\s]",
        "",
        value.strip()
    )


# ============================================================
# FIELD MAPPINGS
# ============================================================

FIELD_RULES = {

    # Names
    "firstname": clean_name,
    "lastname": clean_name,
    "knownas": clean_name,
    "othername": clean_name,
    "titlehonorific": clean_name,

    # Email
    "email": clean_email,

    # Phone
    "phonenumber": clean_phone,

    # NI Number
    "ninumber": clean_ni_number,
    "nationalinsurancenumber": clean_ni_number,

    # Postcode
    "postcode": clean_postcode,

    # Addresses
    "address1": clean_address,
    "address2": clean_address,
    "address3": clean_address,
    "address4": clean_address,
    "address5": clean_address,
    "streetaddress1": clean_address,
    "streetaddress2": clean_address,
    "locationname": clean_address,

    # Position / Codes
    "position": clean_position,

    # Titles
    "jobtitle": clean_job_title,
    "trainingjobtitle": clean_job_title,

    # Projects
    "projectnumber": clean_project_reference,
    "assigntojob": clean_project_reference
}


# ============================================================
# SOURCE DETECTION
# ============================================================

def detect_source_system(payload: dict) -> str:

    if "DisplayId" in payload:
        return "Cascade"

    if "PPACID" in payload:
        return "RecruiterFlow"

    return "Unknown"


# ============================================================
# CORRELATION ID
# ============================================================

def get_correlation_id(payload: dict) -> str:

    return (
        payload.get("DisplayId")
        or payload.get("PPACID")
        or payload.get("EmployeeId")
        or payload.get("Id")
        or str(payload.get("id"))
        or "UNKNOWN"
    )


# ============================================================
# STRUCTURED LOGGING
# ============================================================

def log_field_change(
    correlation_id: str,
    source_system: str,
    field_name: str,
    original: str,
    cleaned: str
) -> None:

    log_event = {
        "event": "data_cleansed",
        "sourceSystem": source_system,
        "correlationId": correlation_id,
        "field": field_name,
        "original": original,
        "cleaned": cleaned
    }

    logging.info(json.dumps(log_event))


# ============================================================
# RULE LOOKUP
# ============================================================

def get_rule(field_name: str):

    return FIELD_RULES.get(field_name.lower())


# ============================================================
# PAYLOAD CLEANSER
# ============================================================

def cleanse_payload(
    payload: Any,
    correlation_id: str,
    source_system: str,
    stats: dict
) -> Any:

    if payload is None:
        return None

    if isinstance(payload, list):

        return [
            cleanse_payload(
                item,
                correlation_id,
                source_system,
                stats
            )
            for item in payload
        ]

    if isinstance(payload, dict):

        result = {}

        for key, value in payload.items():

            if value is None:
                result[key] = None
                continue

            if isinstance(value, (dict, list)):

                result[key] = cleanse_payload(
                    value,
                    correlation_id,
                    source_system,
                    stats
                )

                continue

            rule = get_rule(key)

            if not rule:
                result[key] = value
                continue

            try:

                original = str(value)
                cleaned = rule(original)

                result[key] = cleaned

                if original != cleaned:

                    stats["fields_modified"] += 1

                    log_field_change(
                        correlation_id=correlation_id,
                        source_system=source_system,
                        field_name=key,
                        original=original,
                        cleaned=cleaned
                    )

            except Exception:

                logging.exception(
                    "Failed cleaning field '%s'",
                    key
                )

                result[key] = value

        return result

    return payload


# ============================================================
# ENTRY POINT
# ============================================================

def process_payload(payload: dict) -> dict:

    source_system = detect_source_system(payload)

    correlation_id = get_correlation_id(payload)

    stats = {
        "fields_modified": 0
    }

    cleaned_payload = cleanse_payload(
        payload=payload,
        correlation_id=correlation_id,
        source_system=source_system,
        stats=stats
    )

    logging.info(
        json.dumps(
            {
                "event": "payload_processed",
                "sourceSystem": source_system,
                "correlationId": correlation_id,
                "fieldsModified": stats["fields_modified"]
            }
        )
    )

    return cleaned_payload
