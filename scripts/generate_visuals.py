import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as patches

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, "docs", "assets")
os.makedirs(ASSETS_DIR, exist_ok=True)


def make_before_after():
    fig, ax = plt.subplots(figsize=(10, 4.4), dpi=200)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 44)
    ax.axis("off")

    # Title
    ax.text(50, 41.5, "Why AgriDrishti Assam (AranyaPulse)? — From Reactive Firefighting to Early Prevention",
            ha="center", va="center", fontsize=11, fontweight="bold", color="#0f172a")

    # Left Panel: TODAY (Reactive)
    left_bg = patches.FancyBboxPatch((2, 3), 46, 35, boxstyle="round,pad=0.6,rounding_size=1.5",
                                     facecolor="#fef2f2", edgecolor="#ef4444", linewidth=1.6)
    ax.add_patch(left_bg)
    ax.text(25, 35.5, "TODAY: REACTIVE WORKFLOW", ha="center", va="center",
            fontsize=9.5, fontweight="bold", color="#b91c1c")

    left_steps = [
        (26.5, "1. Late Visual Detection", "Farmer spots yellowed/damaged leaves\nonly after outbreak has spread"),
        (17.5, "2. Delayed Field Visit", "Extension officer visits 4-7 days later;\nno sub-plot drone or weather context"),
        (8.5, "3. Blanket Chemical Spray", "Generic pesticide sprayed across whole field;\nhigh cost, crop loss & soil harm"),
    ]
    for y, title, desc in left_steps:
        box = patches.FancyBboxPatch((5, y - 3.2), 40, 6.4, boxstyle="round,pad=0.3,rounding_size=1.0",
                                     facecolor="#ffffff", edgecolor="#fca5a5", linewidth=1.1)
        ax.add_patch(box)
        ax.text(7, y + 1.1, title, ha="left", va="center", fontsize=8.3, fontweight="bold", color="#991b1b")
        ax.text(7, y - 1.3, desc, ha="left", va="center", fontsize=7.2, color="#475569")

    # Right Panel: WITH AGRIDRISHTI ASSAM
    right_bg = patches.FancyBboxPatch((52, 3), 46, 35, boxstyle="round,pad=0.6,rounding_size=1.5",
                                      facecolor="#ecfdf5", edgecolor="#10b981", linewidth=1.6)
    ax.add_patch(right_bg)
    ax.text(75, 35.5, "WITH AGRIDRISHTI ASSAM (PROACTIVE)", ha="center", va="center",
            fontsize=9.5, fontweight="bold", color="#047857")

    right_steps = [
        (26.5, "1. Early Warning (6-12 Days Ahead)", "Satellite + Drone + Weather fusion flags\ninvisible canopy stress early"),
        (17.5, "2. Guided Field Verification", "Officer inspects exact GPS hotspot &\nverifies on mobile with audit log"),
        (8.5, "3. Targeted Multilingual IPM", "Assamese/Bengali/Bodo SMS sent;\n30% less chemical & saved yield"),
    ]
    for y, title, desc in right_steps:
        box = patches.FancyBboxPatch((55, y - 3.2), 40, 6.4, boxstyle="round,pad=0.3,rounding_size=1.0",
                                     facecolor="#ffffff", edgecolor="#6ee7b7", linewidth=1.1)
        ax.add_patch(box)
        ax.text(57, y + 1.1, title, ha="left", va="center", fontsize=8.3, fontweight="bold", color="#065f46")
        ax.text(57, y - 1.3, desc, ha="left", va="center", fontsize=7.2, color="#475569")

    # Downward arrows inside panels
    for x in [25, 75]:
        ax.annotate("", xy=(x, 21.1), xytext=(x, 23.0), arrowprops=dict(arrowstyle="->", color="#64748b", lw=1.4))
        ax.annotate("", xy=(x, 12.1), xytext=(x, 14.0), arrowprops=dict(arrowstyle="->", color="#64748b", lw=1.4))

    fig.savefig(os.path.join(ASSETS_DIR, "vis1_before_after.png"), bbox_inches="tight")
    plt.close(fig)


def make_three_tier():
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=200)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 45)
    ax.axis("off")

    ax.text(50, 42.5, "How It Works: 3-Tier 'Eye in the Sky to Farmer's Hand' System",
            ha="center", va="center", fontsize=11, fontweight="bold", color="#0f172a")

    tiers = [
        (30, "#eff6ff", "#0284c7", "TIER 1 · SATELLITE (10m Resolution · District Scale)",
         "Sentinel-2 scans every Assam block every 5 days, detecting abnormal vegetation/moisture dips against crop calendars."),
        (17, "#fff7ed", "#ea580c", "TIER 2 · UAV DRONE + WEATHER AI (3cm Resolution · Hotspot Pinpoint)",
         "Drones survey flagged blocks & weather models forecast pest risk 6-12 days early, separating nutrient vs. pest stress."),
        (4, "#ecfdf5", "#059669", "TIER 3 · EXTENSION OFFICER + FARMER (Human-in-the-Loop & Local SMS)",
         "Field officer verifies the GPS hotspot on mobile; system logs audit trail & sends Assamese/Bengali/Bodo IPM advisory."),
    ]
    for y0, fc, ec, title, desc in tiers:
        box = patches.FancyBboxPatch((6, y0), 88, 9.2, boxstyle="round,pad=0.5,rounding_size=1.2",
                                     facecolor=fc, edgecolor=ec, linewidth=1.6)
        ax.add_patch(box)
        ax.text(9, y0 + 6.2, title, ha="left", va="center", fontsize=9, fontweight="bold", color=ec)
        ax.text(9, y0 + 2.6, desc, ha="left", va="center", fontsize=8, color="#1e293b")

    ax.annotate("", xy=(50, 26.8), xytext=(50, 29.5), arrowprops=dict(arrowstyle="->", color="#334155", lw=2.0))
    ax.annotate("", xy=(50, 13.8), xytext=(50, 16.5), arrowprops=dict(arrowstyle="->", color="#334155", lw=2.0))

    fig.savefig(os.path.join(ASSETS_DIR, "vis2_three_tier.png"), bbox_inches="tight")
    plt.close(fig)


def make_multicrop_wheel():
    fig, ax = plt.subplots(figsize=(10, 4.0), dpi=200)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 40)
    ax.axis("off")

    ax.text(50, 37.5, "Multi-Crop Compatibility Across All Major Agricultural & Horticultural Crops of Assam",
            ha="center", va="center", fontsize=10.5, fontweight="bold", color="#0f172a")

    cards = [
        (4, 21, "Sali & Boro Paddy", "Rice Blast & BPH", "Jorhat / Upper Assam", "#059669"),
        (36, 21, "Tea Plantations", "Tea Mosquito Bug", "Dibrugarh / Tinsukia", "#0d9488"),
        (68, 21, "Potato", "Late Blight", "Barpeta / Lower Assam", "#dc2626"),
        (4, 4, "Mustard (Rabi)", "Mustard Aphid", "Nagaon / Central Assam", "#d97706"),
        (36, 4, "Maize", "Fall Armyworm", "Karbi Anglong / Hill Zone", "#2563eb"),
        (68, 4, "Horticulture (Banana)", "Sigatoka & N-Deficit", "Goalpara / Lower Assam", "#7c3aed"),
    ]
    for x0, y0, crop, threat, region, col in cards:
        card = patches.FancyBboxPatch((x0, y0), 28, 12.5, boxstyle="round,pad=0.4,rounding_size=1.2",
                                      facecolor="#f8fafc", edgecolor=col, linewidth=1.5)
        ax.add_patch(card)
        ax.text(x0 + 14, y0 + 9.4, crop, ha="center", va="center", fontsize=9.2, fontweight="bold", color="#0f172a")
        ax.text(x0 + 14, y0 + 5.7, f"Target: {threat}", ha="center", va="center", fontsize=8, fontweight="bold", color=col)
        ax.text(x0 + 14, y0 + 2.4, f"Pilot Zone: {region}", ha="center", va="center", fontsize=7.3, color="#475569")

    fig.savefig(os.path.join(ASSETS_DIR, "vis3_multicrop_wheel.png"), bbox_inches="tight")
    plt.close(fig)


def make_roadmap_gantt():
    fig, ax = plt.subplots(figsize=(10, 3.6), dpi=200)
    phases = [
        ("Phase 4: Controlled Block Pilot & Scaling Blueprint", 16, 8, "#7c3aed"),
        ("Phase 3: Field App, Multilingual SMS & MVP Freeze", 10, 6, "#059669"),
        ("Phase 2: Satellite/UAV Pipeline & Forecasting AI", 4, 6, "#0284c7"),
        ("Phase 1: ASSAC/Agri Alignment & Crop Rules", 0, 4, "#ea580c"),
    ]
    for idx, (label, start, dur, color) in enumerate(phases):
        ax.barh(idx, dur, left=start, height=0.55, color=color, alpha=0.88, edgecolor="#0f172a", linewidth=0.6)
        ax.text(start + dur / 2, idx, f"W{start+1}-W{start+dur}", ha="center", va="center",
                color="white", fontsize=8, fontweight="bold")

    ax.axvline(16, color="#dc2626", linestyle="--", linewidth=1.6)
    ax.text(16.3, 3.35, "Week 16: Validation-Ready MVP", color="#dc2626", fontsize=8.5, fontweight="bold")

    ax.set_yticks(range(len(phases)))
    ax.set_yticklabels([p[0] for p in phases], fontsize=8.5, fontweight="bold", color="#1e293b")
    ax.set_xlim(0, 25)
    ax.set_xticks(range(0, 25, 2))
    ax.set_xticklabels([f"W{w}" for w in range(0, 25, 2)], fontsize=8)
    ax.set_xlabel("Project Timeline (24 Weeks / 6 Months)", fontsize=8.5, fontweight="bold")
    ax.set_title("Indicative 24-Week Development & Pilot Validation Roadmap", fontsize=10.5, fontweight="bold", color="#0f172a")
    ax.grid(axis="x", alpha=0.25)
    fig.tight_layout()
    fig.savefig(os.path.join(ASSETS_DIR, "vis4_roadmap_gantt.png"), bbox_inches="tight")
    plt.close(fig)


def make_drone_rgb_vs_stress():
    rng = np.random.default_rng(42)
    h, w = 80, 100
    # Synthetic lush green canopy texture
    base_g = 0.55 + 0.08 * rng.normal(size=(h, w))
    rgb = np.zeros((h, w, 3))
    rgb[:, :, 0] = np.clip(0.18 + 0.04 * rng.normal(size=(h, w)), 0.05, 0.35)
    rgb[:, :, 1] = np.clip(base_g, 0.35, 0.78)
    rgb[:, :, 2] = np.clip(0.16 + 0.03 * rng.normal(size=(h, w)), 0.05, 0.30)

    # Create two early stress Gaussian hotspots (invisible to naked eye)
    yy, xx = np.mgrid[0:h, 0:w]
    hotspot1 = np.exp(-((xx - 35) ** 2 + (yy - 30) ** 2) / (2 * 9.5 ** 2))
    hotspot2 = np.exp(-((xx - 68) ** 2 + (yy - 52) ** 2) / (2 * 8.0 ** 2))
    stress = np.clip(0.95 * hotspot1 + 0.85 * hotspot2, 0, 1)

    fig, axes = plt.subplots(1, 2, figsize=(10, 4.1), dpi=200)
    axes[0].imshow(rgb)
    axes[0].set_title("Normal Drone Camera (RGB)\nLooks Healthy to the Naked Eye", fontweight="bold", fontsize=9.5, color="#065f46")
    axes[0].axis("off")

    axes[1].imshow(rgb)
    masked_stress = np.ma.masked_where(stress < 0.22, stress)
    im = axes[1].imshow(masked_stress, cmap="autumn_r", alpha=0.78, vmin=0.2, vmax=1.0)
    axes[1].set_title("AgriDrishti Multispectral + Thermal View\nEarly Stress Pinpointed 8 Days Earlier", fontweight="bold", fontsize=9.5, color="#b91c1c")
    axes[1].axis("off")

    # Annotate hotspots
    axes[1].annotate("Hotspot A\n(+2.3°C ΔT)", xy=(35, 30), xytext=(8, 12),
                     arrowprops=dict(arrowstyle="->", color="white", lw=1.4),
                     color="white", fontsize=7.5, fontweight="bold",
                     bbox=dict(boxstyle="round,pad=0.2", fc="#dc2626", ec="white", lw=0.8))
    axes[1].annotate("Hotspot B\n(NDRE Dip)", xy=(68, 52), xytext=(62, 72),
                     arrowprops=dict(arrowstyle="->", color="white", lw=1.4),
                     color="white", fontsize=7.5, fontweight="bold",
                     bbox=dict(boxstyle="round,pad=0.2", fc="#ea580c", ec="white", lw=0.8))

    cbar = fig.colorbar(im, ax=axes[1], fraction=0.046, pad=0.03)
    cbar.set_label("Stress Intensity", fontsize=8)
    fig.suptitle("Why Drones + Multispectral Sensors Beat Visual Scouting Alone", fontsize=10.5, fontweight="bold", color="#0f172a")
    fig.tight_layout()
    fig.savefig(os.path.join(ASSETS_DIR, "vis5_drone_rgb_vs_stress.png"), bbox_inches="tight")
    plt.close(fig)


def make_mobile_advisory_ui():
    fig, ax = plt.subplots(figsize=(10, 4.6), dpi=200)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 46)
    ax.axis("off")

    ax.text(50, 43.5, "Last-Mile Usability: Farmer Multilingual SMS & Field Officer Verification App",
            ha="center", va="center", fontsize=10.5, fontweight="bold", color="#0f172a")

    # Left Phone: Farmer SMS / WhatsApp
    p1 = patches.FancyBboxPatch((8, 3), 36, 37, boxstyle="round,pad=0.4,rounding_size=2.5",
                                facecolor="#0f172a", edgecolor="#334155", linewidth=2.0)
    ax.add_patch(p1)
    s1 = patches.FancyBboxPatch((9.8, 5), 32.4, 33, boxstyle="round,pad=0.2,rounding_size=1.5",
                                facecolor="#f8fafc", edgecolor="#cbd5e1", linewidth=0.8)
    ax.add_patch(s1)
    ax.text(26, 35.8, "FARMER SMS / WHATSAPP", ha="center", va="center", fontsize=8, fontweight="bold", color="#065f46")
    msg_box = patches.FancyBboxPatch((11.5, 16), 29, 17.5, boxstyle="round,pad=0.3,rounding_size=1.0",
                                     facecolor="#dcfce7", edgecolor="#22c55e", linewidth=1.0)
    ax.add_patch(msg_box)
    ax.text(13, 31, "[AgriDrishti Assam · Titabor]", fontsize=7.5, fontweight="bold", color="#166534")
    ax.text(13, 27.5, "Crop: Sali Paddy | Threat: Rice Blast", fontsize=7.2, color="#1e293b")
    ax.text(13, 24.5, "Risk: HIGH (74%) · 6-Day Lead Window", fontsize=7.2, fontweight="bold", color="#b91c1c")
    ax.text(13, 19.5, "Action: Inspect 7 GPS hotspots.\nDrain excess water & apply targeted\nIPM only in verified clusters.", fontsize=6.9, color="#334155")
    ax.text(26, 10.5, "Delivered in:\nAssamese · Bengali · Bodo · English", ha="center", va="center",
            fontsize=7.3, fontweight="bold", color="#0284c7")

    # Right Phone: Field Officer Verification
    p2 = patches.FancyBboxPatch((56, 3), 36, 37, boxstyle="round,pad=0.4,rounding_size=2.5",
                                facecolor="#0f172a", edgecolor="#334155", linewidth=2.0)
    ax.add_patch(p2)
    s2 = patches.FancyBboxPatch((57.8, 5), 32.4, 33, boxstyle="round,pad=0.2,rounding_size=1.5",
                                facecolor="#f8fafc", edgecolor="#cbd5e1", linewidth=0.8)
    ax.add_patch(s2)
    ax.text(74, 35.8, "EXTENSION OFFICER APP", ha="center", va="center", fontsize=8, fontweight="bold", color="#1e40af")

    card2 = patches.FancyBboxPatch((59.5, 22), 29, 11.5, boxstyle="round,pad=0.3,rounding_size=0.8",
                                   facecolor="#ffffff", edgecolor="#94a3b8", linewidth=0.9)
    ax.add_patch(card2)
    ax.text(61, 31.2, "Alert #ALT-2026-1103 (89% Conf.)", fontsize=7.3, fontweight="bold", color="#0f172a")
    ax.text(61, 27.8, "Driver: 89% RH + 12.5h Leaf Wetness", fontsize=6.8, color="#475569")
    ax.text(61, 24.5, "Officer Note: Spindle lesions in 3/7 plots", fontsize=6.8, color="#065f46")

    btn1 = patches.FancyBboxPatch((59.5, 15.5), 14, 4.2, boxstyle="round,pad=0.2,rounding_size=0.6",
                                  facecolor="#059669", edgecolor="#047857", linewidth=0.8)
    ax.add_patch(btn1)
    ax.text(66.5, 17.6, "Verify Truth", ha="center", va="center", fontsize=7, fontweight="bold", color="white")

    btn2 = patches.FancyBboxPatch((74.5, 15.5), 14, 4.2, boxstyle="round,pad=0.2,rounding_size=0.6",
                                  facecolor="#0284c7", edgecolor="#0369a1", linewidth=0.8)
    ax.add_patch(btn2)
    ax.text(81.5, 17.6, "UAV Re-flight", ha="center", va="center", fontsize=7, fontweight="bold", color="white")

    audit_box = patches.FancyBboxPatch((59.5, 7), 29, 6.5, boxstyle="round,pad=0.2,rounding_size=0.6",
                                       facecolor="#eff6ff", edgecolor="#60a5fa", linewidth=0.8)
    ax.add_patch(audit_box)
    ax.text(74, 10.2, "Immutable Audit Log Recorded\nActor: S. Bora (ADO) · 2026-11-24 10:05 IST",
            ha="center", va="center", fontsize=6.7, fontweight="bold", color="#1e3a8a")

    fig.savefig(os.path.join(ASSETS_DIR, "vis6_mobile_advisory_ui.png"), bbox_inches="tight")
    plt.close(fig)


if __name__ == "__main__":
    make_before_after()
    make_three_tier()
    make_multicrop_wheel()
    make_roadmap_gantt()
    make_drone_rgb_vs_stress()
    make_mobile_advisory_ui()
    print("Generated 6 layman-friendly visual assets in docs/assets/.")
