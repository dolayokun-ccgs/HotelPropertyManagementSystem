import json
import logging

import azure.functions as func

from regex_cleaner import process_payload

app = func.FunctionApp()


@app.function_name(name="RegexCleaner")
@app.route(
    route="cleanse",
    auth_level=func.AuthLevel.FUNCTION
)
def cleanse(req: func.HttpRequest) -> func.HttpResponse:

    try:

        payload = req.get_json()

        cleaned_payload = process_payload(payload)

        return func.HttpResponse(
            body=json.dumps(
                cleaned_payload,
                ensure_ascii=False
            ),
            mimetype="application/json",
            status_code=200
        )

    except Exception as ex:

        logging.exception(
            "Payload cleansing failed"
        )

        return func.HttpResponse(
            body=json.dumps(
                {
                    "error": str(ex)
                }
            ),
            mimetype="application/json",
            status_code=500
        )
