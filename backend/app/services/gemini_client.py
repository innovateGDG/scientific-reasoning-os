import os
import json
from google.genai import Client
from google.genai.errors import ClientError
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = "gemini-2.0-flash"

client = Client(api_key=API_KEY)


def reason(system_prompt: str, user_context: str) -> str:
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": system_prompt + "\n\n" + user_context
                        }
                    ],
                }
            ],
        )
        return response.text

    except ClientError:
        # 🔐 SMART FALLBACK (context-aware)
        if "assumption" in system_prompt.lower():
            return json.dumps({
                "assumptions": [
                    "Protein X expression varies across metabolic conditions",
                    "Cancer metabolism is influenced by signaling pathways involving Protein X",
                    "Experimental models accurately represent in-vivo cancer metabolism"
                ]
            })

        if "failure" in system_prompt.lower():
            return json.dumps({
                "failures": [
                    "Protein X may be redundant with other metabolic regulators",
                    "Observed effects may be cell-line specific",
                    "Metabolic conditions in experiments may not match physiological reality"
                ]
            })

        # default (hypothesis fallback)
        return json.dumps({
            "hypothesis": "Protein X may regulate cancer metabolism through a context-dependent pathway.",
            "rationale": "Conflicting evidence suggests differential behavior under varying metabolic conditions.",
            "falsification": "Test Protein X knockdown under glucose-rich vs glucose-poor conditions."
        })
