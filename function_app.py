import json
import logging
import azure.functions as func

from regex_cleaner import cleanse_payload

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)


@app.route(route="cleanse")
def cleanse(req: func.HttpRequest) -> func.HttpResponse:

    try:

        payload = req.get_json()

        cleaned_payload = cleanse_payload(payload)

        return func.HttpResponse(
            body=json.dumps(cleaned_payload),
            mimetype="application/json",
            status_code=200
        )

    except Exception as ex:

        logging.exception("Payload cleansing failed")

        return func.HttpResponse(
            body=str(ex),
            status_code=500
        )
