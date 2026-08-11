using UnityEngine;
using System.Collections;

/// <summary>
/// AnimationController - Gestiona todas las animaciones y VFX del playable
/// Animaciones de caja, pantallas, transiciones y efectos visuales
/// </summary>
public class AnimationController : MonoBehaviour
{
    [Header("Box References")]
    [SerializeField] private Transform boxTransform;
    [SerializeField] private ParticleSystem boxSparklesVFX;

    [Header("Screen References")]
    [SerializeField] private Transform cvScreen;
    [SerializeField] private Transform offerScreen;
    [SerializeField] private RectTransform cvContentRect;
    [SerializeField] private RectTransform offerContentRect;

    [Header("Animation Settings")]
    [SerializeField] private float boxBobSpeed = 2f;
    [SerializeField] private float boxBobHeight = 0.3f;
    [SerializeField] private float boxHighlightDuration = 1.5f;
    [SerializeField] private float screenAnimDuration = 0.8f;
    [SerializeField] private float checkmarkAnimDuration = 0.5f;
    [SerializeField] private AnimationCurve easingCurve = AnimationCurve.EaseInOutCubic();

    private Vector3 boxInitialPosition;
    private bool isBoxAnimating = false;

    private void Start()
    {
        if (boxTransform != null)
            boxInitialPosition = boxTransform.position;
    }

    /// <summary>
    /// Animación intro: cámara zoom/transición
    /// </summary>
    public void PlayIntroAnimation()
    {
        Debug.Log("[AnimationController] Reproduciendo animación intro");
        StartCoroutine(IntroAnimationSequence());
    }

    private IEnumerator IntroAnimationSequence()
    {
        // Aquí iría la animación de cámara/fade
        // Por ahora es un placeholder
        yield return new WaitForSeconds(1f);
        Debug.Log("[AnimationController] Intro terminada");
    }

    /// <summary>
    /// Animación idle de la caja: bobbing/pulso
    /// </summary>
    public void PlayBoxIdleAnimation()
    {
        if (boxTransform == null) return;
        
        StartCoroutine(BoxBobbingAnimation());
    }

    private IEnumerator BoxBobbingAnimation()
    {
        isBoxAnimating = true;

        while (isBoxAnimating)
        {
            float newY = boxInitialPosition.y + Mathf.Sin(Time.time * boxBobSpeed) * boxBobHeight;
            boxTransform.position = new Vector3(boxInitialPosition.x, newY, boxInitialPosition.z);
            yield return null;
        }
    }

    /// <summary>
    /// VFX Sparkles cuando se clickea la caja
    /// </summary>
    public void PlayBoxSparkles()
    {
        if (boxSparklesVFX != null)
        {
            boxSparklesVFX.Play();
            Debug.Log("[AnimationController] Sparkles VFX reproducido");
        }
    }

    /// <summary>
    /// Highlight en requirement text de pantalla derecha
    /// </summary>
    public void HighlightRequirementOnScreen(int requirementIndex, bool highlight)
    {
        StartCoroutine(HighlightScreenAnimation(requirementIndex, highlight));
    }

    private IEnumerator HighlightScreenAnimation(int index, bool highlight)
    {
        float elapsed = 0f;
        float duration = 0.4f;

        // Scale animation en pantalla derecha
        Vector3 targetScale = highlight ? Vector3.one * 1.1f : Vector3.one;
        Vector3 initialScale = offerScreen.localScale;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = easingCurve.Evaluate(elapsed / duration);
            offerScreen.localScale = Vector3.Lerp(initialScale, targetScale, t);
            yield return null;
        }

        offerScreen.localScale = targetScale;
    }

    /// <summary>
    /// Animar CV con check cuando se completa un requirement
    /// </summary>
    public void AnimateCheckOnCVScreen(int requirementIndex)
    {
        StartCoroutine(CheckmarkAnimationSequence(requirementIndex));
    }

    private IEnumerator CheckmarkAnimationSequence(int index)
    {
        // Scale animation en pantalla izquierda
        Vector3 initialScale = cvScreen.localScale;
        Vector3 targetScale = initialScale * 1.05f;
        float elapsed = 0f;

        while (elapsed < checkmarkAnimDuration)
        {
            elapsed += Time.deltaTime;
            float t = easingCurve.Evaluate(elapsed / checkmarkAnimDuration);
            cvScreen.localScale = Vector3.Lerp(initialScale, targetScale, t);
            yield return null;
        }

        // Volver a escala original
        elapsed = 0f;
        while (elapsed < checkmarkAnimDuration)
        {
            elapsed += Time.deltaTime;
            float t = easingCurve.Evaluate(elapsed / checkmarkAnimDuration);
            cvScreen.localScale = Vector3.Lerp(targetScale, initialScale, t);
            yield return null;
        }

        cvScreen.localScale = initialScale;
    }

    /// <summary>
    /// Animación final: pantallas se alejan/fade out
    /// </summary>
    public void PlayFinalAnimation()
    {
        Debug.Log("[AnimationController] Reproduciendo animación final");
        StartCoroutine(FinalAnimationSequence());
    }

    private IEnumerator FinalAnimationSequence()
    {
        // Fade out de pantallas
        CanvasGroup cvCG = cvScreen.GetComponent<CanvasGroup>();
        CanvasGroup offerCG = offerScreen.GetComponent<CanvasGroup>();

        if (cvCG == null) cvCG = cvScreen.gameObject.AddComponent<CanvasGroup>();
        if (offerCG == null) offerCG = offerScreen.gameObject.AddComponent<CanvasGroup>();

        float elapsed = 0f;
        float duration = 1f;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = elapsed / duration;
            cvCG.alpha = Mathf.Lerp(1f, 0.3f, t);
            offerCG.alpha = Mathf.Lerp(1f, 0.3f, t);
            yield return null;
        }

        Debug.Log("[AnimationController] Animación final completada");
    }

    /// <summary>
    /// Parar animación de caja
    /// </summary>
    public void StopBoxAnimation()
    {
        isBoxAnimating = false;
    }

    /// <summary>
    /// Pulso en caja (feedback visual)
    /// </summary>
    public void PulseBox()
    {
        StartCoroutine(BoxPulseAnimation());
    }

    private IEnumerator BoxPulseAnimation()
    {
        Vector3 initialScale = boxTransform.localScale;
        float elapsed = 0f;
        float duration = 0.3f;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = elapsed / duration;
            boxTransform.localScale = Vector3.Lerp(initialScale, initialScale * 1.2f, Mathf.Sin(t * Mathf.PI));
            yield return null;
        }

        boxTransform.localScale = initialScale;
    }
}
