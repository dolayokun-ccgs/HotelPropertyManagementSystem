import logging
import re
from typing import Any, Dict


# =====================================================
# CLEANING FUNCTIONS
# =====================================================

def clean_name(value: str) -> str:
    """
    Allows:
        Letters
        Spaces
        Apostrophes
        Hyphens
    Examples:
        O'Connor
        Robert-Florinel
    """
    value = value.strip()
    return re.sub(r"[^A-Za-z\s'\-]", "", value)


def clean_email(value: str) -> str:
    """
    Trim and lowercase.
    """
    return value.strip().lower()


def clean_phone(value: str) -> str:
    """
    Retain digits only.

    Example:
        (07393) 584-791
        -> 07393584791
    """
    return re.sub(r"[^0-9]", "", value)


def clean_ni_number(value: str) -> str:
    """
    National Insurance Number

    Example:
        SR 857550 C
        -> SR857550C
    """
    value = re.sub(r"[^A-Za-z0-9]", "", value)
    return value.upper()


def clean_postcode(value: str) -> str:
    """
    Normalize UK postcode.

    Example:
        da12 5bs
        DA12-5BS

        -> DA12 5BS
    """
    value = re.sub(r"[^A-Za-z0-9]", "", value).upper()

    if len(value) > 3:
        value = f"{value[:-3]} {value[-3:]}"

    return value


def clean_address(value: str) -> str:
    """
    Preserve normal address punctuation.

    Example:
        Flat 2/3 King's Court
        17, Silkfield Road
    """
    value = value.strip()

    return re.sub(
        r"[^\w\s,\-'/]",
        "",
        value
    )


def clean_position(value: str) -> str:
    """
    Position / Job Code.

    Example:
        JT0482
        JT/0482

        -> JT0482
    """
    return re.sub(
        r"[^A-Za-z0-9]",
        "",
        value.strip()
    )


def clean_job_title(value: str) -> str:
    """
    Preserve common job title punctuation.

    Example:
        Senior QA/QC Manager
        Mechanical & Electrical Lead
    """
    return re.sub(
        r"[^A-Za-z0-9\s&\-/]",
        "",
        value.strip()
    )


def clean_project_reference(value: str) -> str:
    """
    Preserve dots and dashes.

    Example:
        BE0016.01
    """
    return re.sub(
        r"[^A-Za-z0-9.\-\s]",
        "",
        value.strip()
    )


# =====================================================
# FIELD MAPPINGS
# =====================================================

FIELD_RULES = {

    # Names
    "firstname": clean_name,
    "lastname": clean_name,
    "knownas": clean_name,
    "othername": clean_name,
    "titlehonorific": clean_name,

    # Email
    "email": clean_email,
    "value_email": clean_email,

    # Phone
    "phonenumber": clean_phone,

    # National Insurance
    "ninumber": clean_ni_number,
    "nationalinsurancenumber": clean_ni_number,

    # Postcodes
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

    # Positions
    "position": clean_position,

    # Job Titles
    "jobtitle": clean_job_title,
    "trainingjobtitle": clean_job_title,

    # Project references
    "projectnumber": clean_project_reference,
    "assigntojob": clean_project_reference
}


# =====================================================
# FIELD DETECTION
# =====================================================

def get_rule(field_name: str):

    field_name = field_name.lower()

    return FIELD_RULES.get(field_name)


# =====================================================
# PAYLOAD CLEANSER
# =====================================================

def cleanse_payload(payload: Any) -> Any:

    if payload is None:
        return None

    if isinstance(payload, list):
        return [
            cleanse_payload(item)
            for item in payload
        ]

    if isinstance(payload, dict):

        result = {}

        for key, value in payload.items():

            if isinstance(value, (dict, list)):
                result[key] = cleanse_payload(value)
                continue

            if value is None:
                result[key] = None
                continue

            rule = get_rule(key)

            if rule:

                original = str(value)

                try:
                    cleaned = rule(original)

                    if original != cleaned:
                        logging.info(
                            "Field '%s' cleaned: '%s' -> '%s'",
                            key,
                            original,
                            cleaned
                        )

                    result[key] = cleaned

                except Exception as ex:

                    logging.exception(
                        "Cleaning failed for field '%s'",
                        key
                    )

                    result[key] = value

            else:

                result[key] = value

        return result

    return payload
