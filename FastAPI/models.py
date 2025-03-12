from src.swinfir.swinfir.archs.swinfir_arch import SwinFIR  # Thay 'swinfir_module' bằng module thực tế của bạn
from collections import defaultdict
import torch

model_cache = defaultdict(lambda: None)
model_path = {
    2: "experiments/pretrained_models/SwinFIR_SRx2.pth",
    3: "experiments/pretrained_models/SwinFIR_SRx3.pth",
    4: "experiments/pretrained_models/SwinFIR_SRx4.pth"
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