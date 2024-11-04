import asyncio
import aiohttp
import time
import json

url = "http://localhost:8080/v1/chat/completions"

data = {
    "model": "tgi",
    "messages": [
        {"role": "system", "content": "You are a highly intelligent assistant that can analyze complex information."},
        {"role": "user", "content": "¿Puedes explicarme cómo funciona la física cuántica en términos simples?"},
        {"role": "assistant", "content": "Claro, la física cuántica estudia el comportamiento de las partículas a nivel subatómico, donde las leyes de la física clásica no siempre aplican."},
        {"role": "user", "content": "¿Qué es el entrelazamiento cuántico?"},
        {"role": "assistant", "content": "El entrelazamiento cuántico es un fenómeno donde dos partículas se vuelven interdependientes, de modo que el estado de una afecta instantáneamente al estado de la otra, sin importar la distancia entre ellas."},
        {"role": "user", "content": "¿Podrías ponerlo en contexto con una analogía simple?"},
        {"role": "assistant", "content": "Piensa en dos monedas lanzadas al aire. Si están entrelazadas, al ver una cara en una moneda, sabrías instantáneamente que la otra también es cara, sin importar dónde esté."},
        {"role": "user", "content": "Ahora háblame sobre la computación cuántica y cómo usa estos principios."},
        {"role": "assistant", "content": "La computación cuántica utiliza bits cuánticos, o 'qubits', que pueden estar en múltiples estados simultáneamente gracias a la superposición. Esto permite resolver ciertos problemas mucho más rápido que las computadoras clásicas."},
        {"role": "user", "content": "¿Cuál es el estado actual de la computación cuántica?"},
        {"role": "assistant", "content": "Está en sus primeras etapas, pero ya se han logrado avances significativos. Grandes empresas están desarrollando procesadores cuánticos, aunque la tecnología aún no es lo suficientemente estable para aplicaciones masivas."},
        {"role": "user", "content": "¿Cuáles son los principales desafíos para que sea ampliamente utilizada?"},
        {"role": "assistant", "content": "Los principales desafíos son la corrección de errores cuánticos, la estabilidad de los qubits y el desarrollo de algoritmos que aprovechen las capacidades de la computación cuántica."},
        {"role": "user", "content": "Ahora, supongamos que quiero explicar estos conceptos a alguien que solo habla ruso."},
        {"role": "assistant", "content": "Con gusto puedo ayudarte a traducir esta explicación a ruso y adaptar el nivel de detalle según el conocimiento del destinatario."},
        {"role": "user", "content": "Perfecto, ¿podrías explicar el entrelazamiento cuántico y la computación cuántica en ruso, en un lenguaje técnico pero accesible?"},
        {"role": "assistant", "content": "Да, конечно. Запутанность частиц — это явление, при котором частицы становятся взаимозависимыми так, что состояние одной мгновенно влияет на состояние другой, независимо от расстояния."},
        {"role": "user", "content": "Ahora añade referencias a los avances recientes en la tecnología de computación cuántica."},
        {
            "role": "assistant",
            "content": "Конечно. За последние несколько лет компании, такие как IBM и Google, добились успехов в разработке квантовых процессоров, увеличивая количество кубитов и улучшая их стабильность."
        },
        {"role": "user", "content": "Háblame de la ética en el uso de esta tecnología."},
        {"role": "assistant", "content": "La ética en la computación cuántica es crucial, ya que podría cambiar la forma en que se maneja la criptografía y los datos sensibles, lo cual plantea riesgos de seguridad."},
        {"role": "user", "content": "Ahora, imagina que necesitamos presentar estos conceptos en una conferencia internacional y preparar una versión multilingüe."},
        {"role": "assistant", "content": "Podemos estructurar la presentación en secciones, comenzando con un resumen en inglés y luego ofreciendo traducciones en varios idiomas."},
        {
            "role": "user",
            "content": (
                "Excelente, prepara un resumen breve en inglés y luego traduce al ruso y al español. Haz que suene formal y profesional, "
                "indicando los avances y aplicaciones actuales en tecnología cuántica."
            )
        }
    ],
    "stream": True,
    "max_tokens": 300  # Permite respuestas más extensas
}

async def send_request(session):
    start_time = time.time()
    async with session.post(url, json=data) as response:
        response_data = await response.text()
        print(response_data)  # Imprime la respuesta completa
        elapsed_time = time.time() - start_time
        print(f"Response time: {elapsed_time:.2f} seconds")

async def stress_test(request_count):
    async with aiohttp.ClientSession(headers={"Content-Type": "application/json"}) as session:
        tasks = [send_request(session) for _ in range(request_count)]
        await asyncio.gather(*tasks)
        print(f"Completed {request_count} requests.")

# Configura el número de solicitudes que deseas ejecutar en paralelo
request_count = 150  # Reemplaza con el valor deseado
asyncio.run(stress_test(request_count))
