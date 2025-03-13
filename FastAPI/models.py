from swinfir.archs.swinfir_arch import SwinFIR
from collections import defaultdict
from fastapi import HTTPException
from base64 import b64encode
import torch
import numpy as np
import cv2

model_cache = defaultdict(lambda: None)
model_path = {
    2: "/home/vodanhday/VSCode/DoAnCoSo/src/swinfir/experiments/pretrained_models/SwinFIR_SRx2.pth",
    3: "/home/vodanhday/VSCode/DoAnCoSo/src/swinfir/experiments/pretrained_models/SwinFIR_SRx3.pth",
    4: "/home/vodanhday/VSCode/DoAnCoSo/src/swinfir/experiments/pretrained_models/SwinFIR_SRx4.pth"
}

def create_model(device, scale=2):
    if scale not in [2, 3, 4]:
        raise ValueError("Scale factor must be 2, 3, or 4.")
    
    if model_cache[scale] is not None:
        return model_cache[scale]

    model = SwinFIR(
        upscale=scale,
        in_chans=3,
        img_size=60,
        window_size=12,
        img_range=1.,
        depths=[6, 6, 6, 6, 6, 6],
        embed_dim=180,
        num_heads=[6, 6, 6, 6, 6, 6],
        mlp_ratio=2,
        upsampler='pixelshuffle',
        resi_connection='SFB')
    
    loadnet = torch.load(model_path[scale], map_location=device)
    keyname = 'params_ema' if 'params_ema' in loadnet else 'params'
    model.load_state_dict(loadnet[keyname], strict=True)
    
    model_cache[scale] = model
    return model

def process_image(image: np.ndarray, scale: int):
    if image is None:
        raise HTTPException(status_code=400, detail="Vui lòng tải lên một ảnh.")
    try:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model = create_model(device, scale)
        model.eval()
        model = model.to(device)
        img = image.astype(np.float32) / 255.0
        img = torch.from_numpy(np.transpose(img[:, :, [2, 1, 0]], (2, 0, 1))).float()
        img = img.unsqueeze(0).to(device)

        window_size = 12
        _, _, h, w = img.size()
        mod_pad_h = (h // window_size + 1) * window_size - h
        mod_pad_w = (w // window_size + 1) * window_size - w
        img = torch.cat([img, torch.flip(img, [2])], 2)[:, :, :h + mod_pad_h, :]
        img = torch.cat([img, torch.flip(img, [3])], 3)[:, :, :, :w + mod_pad_w]

        with torch.no_grad():
            output = model(img)
        
        output = output[..., :h * scale, :w * scale]
        output = output.data.squeeze().float().cpu().clamp_(0, 1).numpy()
        if output.ndim == 3:
            output = np.transpose(output[[2, 1, 0], :, :], (1, 2, 0))
        output = (output * 255.0).round().astype(np.uint8)
        
        lr_resized = cv2.resize(image, (output.shape[1], output.shape[0]))

        output_bytes = cv2.imencode('.png', output)[1].tobytes()
        lr_resized_bytes = cv2.imencode('.png', lr_resized)[1].tobytes()
        return {
            "lr_resized": b64encode(lr_resized_bytes).decode('utf-8'),
            "output": b64encode(output_bytes).decode('utf-8')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi trong quá trình xử lý ảnh: {str(e)}")