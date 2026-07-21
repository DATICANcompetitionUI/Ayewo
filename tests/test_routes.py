import io
import unittest

from PIL import Image
from starlette.datastructures import UploadFile
from starlette.requests import Request

from app.inference import PredictionResult
from main import create_app


class FakeInferenceService:
    """Keeps route tests fast: no model file or GPU is needed."""

    model_loaded = True
    device = "cpu"

    def __init__(self):
        self.batch_sizes: list[int] = []

    def predict(self, image, *, include_gradcam=True):
        return self.predict_batch([image], include_gradcam=include_gradcam)[0]

    def predict_batch(self, images, *, include_gradcam=True):
        self.batch_sizes.append(len(images))
        return [PredictionResult("Uninfected", 98.5, "cam" if include_gradcam else None, False) for _ in images]


def request_for(app):
    return Request({"type": "http", "method": "POST", "path": "/", "headers": [], "app": app})


def image_upload(filename="cell.png"):
    output = io.BytesIO()
    Image.new("RGB", (8, 8), "white").save(output, format="PNG")
    return UploadFile(filename=filename, file=io.BytesIO(output.getvalue()))


class RouteTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.service = FakeInferenceService()
        self.app = create_app(self.service)
        self.lifespan = self.app.router.lifespan_context(self.app)
        await self.lifespan.__aenter__()

    async def asyncTearDown(self):
        await self.lifespan.__aexit__(None, None, None)

    def endpoint(self, path):
        return next(route.endpoint for route in self.app.routes if route.path == path)

    async def test_single_can_skip_gradcam(self):
        response = await self.endpoint("/predict/single")(request_for(self.app), image_upload(), include_gradcam=False)
        self.assertEqual(response["result"], "Uninfected")
        self.assertIsNone(response["gradcam_image"])
        self.assertEqual(self.service.batch_sizes, [1])

    async def test_batch_uses_one_batched_service_call_and_stores_report(self):
        response = await self.endpoint("/predict/batch")(
            request_for(self.app), [image_upload("one.png"), image_upload("two.png")], include_gradcam=False
        )
        self.assertEqual(self.service.batch_sizes, [2])
        self.assertEqual(len(response["results"]), 2)
        self.assertIn(response["batch_id"], self.app.state.batch_store)

    async def test_invalid_image_returns_a_client_error(self):
        with self.assertRaisesRegex(Exception, "Invalid image file"):
            await self.endpoint("/predict/single")(
                request_for(self.app), UploadFile(filename="not-an-image", file=io.BytesIO(b"nope"))
            )


if __name__ == "__main__":
    unittest.main()
