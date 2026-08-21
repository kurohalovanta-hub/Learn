# Compute Strategy (per HANDOVER §15)

**Source: reports/benchmarks-compute.md (documented numbers, verified 2026-08-21).**

## 1. GPU tiers — what runs where

| Exercise | 12 GB (4070) | 16 GB (4080/5080) | 24 GB (3090/4090) | Cloud only |
|---|---|---|---|---|
| All foundations/DL (GPT-on-Shakespeare, ViT-CIFAR) | ✅ | ✅ | ✅ | — |
| ACT on ALOHA sim (2–6 GB; 30–60 min on 4090) | ✅ | ✅ | ✅ | — |
| Diffusion Policy on PushT (8–14 GB; 2–4 h on 4090) | ✅ (BS↓) | ✅ | ✅ | — |
| PPO/SAC from scratch (Gymnasium MuJoCo) | ✅ | ✅ | ✅ | — |
| MuJoCo Playground GPU RL (Go1 ≈ 7 min on 4090) | ✅ state-based | ✅ | ✅ | — |
| ManiSkill3 vision RL (<15 GB documented) | ⚠️ tight | ✅ | ✅ | — |
| TD-MPC2 single-task (≥8 GB) / DreamerV3 state | ✅ | ✅ | ✅ | — |
| DreamerV3 vision (24 GB rec) / TD-MPC2 317M | ❌ | ⚠️ | ✅ | optional |
| SmolVLA fine-tune (10–16 GB @BS8; ~4 h/20k steps on A100) | ⚠️ BS≤4 + frozen vision | ✅ | ✅ | — |
| π0/π0-FAST **LoRA** via openpi (>22.5 GB documented) | ❌ | ❌ | ✅ | 12/16 GB tiers |
| π0.5 LeRobot PEFT / LIBERO recipe (sized for 80 GB @BS64) | ❌ | ❌ | ⚠️ BS↓/PEFT | ✅ A100 |
| GR00T N1.7 inference (16 GB+) | ❌ | ✅ | ✅ | — |
| GR00T N1.7 fine-tune (<~35 GB default; 40 GB+ rec) | ❌ | ❌ | ⚠️ BS1–2 marginal | ✅ A100/L40S |
| OpenVLA(-OFT) LoRA (≥25–27 GB documented) | ❌ | ❌ | ❌ | ✅ A100 |
| Any full VLA fine-tune (>70 GB) | ❌ | ❌ | ❌ | ✅ 8×H100 class |
| LIBERO 400-episode eval of a VLA (~8–16 GB; est. 2–6 h) | ⚠️ | ✅ | ✅ | — |
| Isaac Lab (official floor 16 GB + RTX card) | ❌ | ✅ floor | ✅ | L40S/4090 nodes (A100/H100 can't render Isaac) |

## 2. Verdicts

- **Minimum viable GPU for the full curriculum including a frontier-lineage VLA fine-tune: 24 GB** (used RTX 3090 ≈ cheapest entry; RTX 4090 is the documented reference card across openpi/ManiSkill/Playground/GR00T/LeRobot).
- **Recommended if buying new: RTX 5090 32 GB** — additionally clears OpenVLA-OFT BS1 (~25 GB) and GR00T's <35 GB default fine-tune. Requires driver ≥580 / cu128+ wheels (routine in Aug 2026).
- **A 16 GB card completes the curriculum** with SmolVLA as the local VLA and ~$130–300 of cloud for the π0-class exercises. **12 GB completes it** with ~$150–400 cloud and reduced-batch local work.
- **Cloud fallback:** RunPod/Vast/Lambda; last-known rates (re-verify — pricing pages were proxy-blocked): 4090 ~$0.35–0.69/h, A100-80 ~$0.9–1.7/h, H100 ~$1.8–3.0/h. The whole program's mandatory cloud spend at the 24 GB tier ≈ **$80–200**.
- **RAM/disk:** 32 GB RAM min (64 GB comfortable); **2 TB disk comfortable** (~300–500 GB working set: LIBERO 1.9 GB LeRobot-format, RoboCasa assets 10 GB, checkpoints; **never mirror full DROID 1.8 TB / OXE 1.2 TB / BEHAVIOR 3.27 TB — stream slices**).
- **OS:** Ubuntu 24.04 native dual-boot recommended from Month 3 (ROS Jazzy Tier-1 + Isaac option + future hardware USB). **WSL2 is viable for ~90%** (LeRobot officially supports it; MuJoCo/MJX/ManiSkill/LIBERO fine) — the moment Isaac Lab, BEHAVIOR, or a physical robot enters, dual-boot.

## 3. The three heaviest exercises → reduced-scale alternatives (pre-decided)

1. **π0.5-DROID-scale full fine-tune** (2 days × 8×H100 + 1.8 TB — documented) → **do instead:** π0-LoRA on a ~50-episode LeRobot dataset on 24 GB, or LeRobot π0.5-PEFT; use the 1.6 GB DROID sample.
2. **OpenVLA-OFT full LIBERO reproduction** (8×A100, 62 GB/GPU, 150k steps) → **do instead:** SmolVLA on `lerobot/libero` locally with the 400-episode protocol + CIs; optional one-suite OFT-LoRA (BS1, ~25 GB) on a rented A100 with 100–150 trials.
3. **GR00T recommended-scale fine-tune / BEHAVIOR-2026** (40 GB+ / 3.27 TB demos) → **do instead:** GR00T-via-LeRobot BS1–2 on 24 GB or one rented A100 for 10–20 h; RoboCasa365 (10 GB) for long-horizon work.

## 4. Rules encoded in the app

Every compute-heavy node/card in the app displays: VRAM requirement (documented source), expected runtime, the reduced-scale alternative, and the cloud cost estimate — per HANDOVER §15. Cloud is only recommended where this document lists it; nothing in the core path requires spending before Month 5, and a $0 pathway (SmolVLA-centric) exists to program completion.
