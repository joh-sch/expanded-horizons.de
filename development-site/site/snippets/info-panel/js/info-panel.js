import Component from 'gia/Component';
import eventbus from 'gia/eventbus';
import { gsap } from 'gsap';

export default class InfoPanel extends Component {
  constructor(el, options) {
    super(el);

    this.ref = {
      backdrop: null,
      panel: null,
      content: null,
      impressumPanel: null,
      impressumContent: null,
      impressumClose: null,
    };

    this.options = {
      peekHeight: 56,
      hoverLift: 16,
      ...options,
    };

    this.isClosing = false;
    this.showingImpressum = false;

    this.handleToggle = this.handleToggle.bind(this);
    this.handlePeekHover = this.handlePeekHover.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handlePanelClick = this.handlePanelClick.bind(this);
    this.handleImpressumClose = this.handleImpressumClose.bind(this);
    this.handlePanelPointerEnter = this.handlePanelPointerEnter.bind(this);
    this.handlePanelPointerLeave = this.handlePanelPointerLeave.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  mount() {
    this.init();
  }

  unmount() {
    eventbus.off('infoPanel:toggle', this.handleToggle);
    eventbus.off('infoPanel:peek-hover', this.handlePeekHover);
    document.removeEventListener('keydown', this.handleKeydown);
  }

  init() {
    gsap.set(this.ref.panel, { y: this.getClosedY() });
    gsap.set(this.ref.impressumPanel, { y: this.ref.impressumPanel.offsetHeight });

    this.ref.backdrop.addEventListener('click', this.handleBackdropClick);
    this.ref.panel.addEventListener('click', this.handlePanelClick, true);
    this.ref.panel.addEventListener('pointerenter', this.handlePanelPointerEnter);
    this.ref.panel.addEventListener('pointerleave', this.handlePanelPointerLeave);
    this.ref.impressumPanel.addEventListener('click', this.handlePanelClick, true);
    this.ref.impressumClose.addEventListener('click', this.handleImpressumClose);
    eventbus.on('infoPanel:toggle', this.handleToggle);
    eventbus.on('infoPanel:peek-hover', this.handlePeekHover);
    document.addEventListener('keydown', this.handleKeydown);
  }

  setViewportPosition(panel) {
    panel.style.position = 'fixed';
    panel.style.bottom = '0';
    panel.style.top = 'auto';
  }

  getClosedY() {
    return Math.max(this.ref.panel.offsetHeight - this.options.peekHeight, 0);
  }

  getOpenTop(panel) {
    const bar = document.getElementById('intro-bar');
    const barBottom = bar?.getBoundingClientRect().bottom || 0;

    return Math.max(barBottom + 16, window.innerHeight - panel.offsetHeight);
  }

  setOpenPosition(panel) {
    const top = this.getOpenTop(panel);

    panel.style.position = 'fixed';
    panel.style.top = `${top}px`;
    panel.style.bottom = 'auto';

    return top;
  }

  movePanelIntoDocumentFlow(panel, top) {
    const wrapperTop = this.element.getBoundingClientRect().top + window.scrollY;
    const absoluteTop = window.scrollY + top - wrapperTop;

    panel.style.position = 'absolute';
    panel.style.top = `${absoluteTop}px`;
    panel.style.bottom = 'auto';
    this.element.style.minHeight = `${absoluteTop + panel.offsetHeight + 32}px`;
  }

  resetPanelToViewport(panel) {
    const rect = panel.getBoundingClientRect();
    const viewportBottomTop = window.innerHeight - panel.offsetHeight;

    this.setViewportPosition(panel);
    gsap.set(panel, { y: rect.top - viewportBottomTop });

    return panel === this.ref.panel ? this.getClosedY() : panel.offsetHeight;
  }

  handleToggle() {
    if (this.showingImpressum) {
      this.closeImpressum();
      return;
    }

    this.setState({ open: !this.state.open });
  }

  handlePeekHover(event) {
    if (this.state.open || this.isClosing || this.showingImpressum) return;

    gsap.to(this.ref.panel, {
      y: event.hovering ? this.getClosedY() - this.options.hoverLift : this.getClosedY(),
      duration: 0.2,
      ease: 'power2.out',
    });
  }

  handleBackdropClick() {
    if (this.showingImpressum) {
      this.closeImpressum();
      return;
    }

    this.setState({ open: false });
  }

  handlePanelClick(event) {
    const impressumLink = event.target.closest('[data-info-panel-target="impressum"]');

    if (impressumLink) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.openImpressum();
      return;
    }

    if (!this.showingImpressum && !this.state.open) this.setState({ open: true });
  }

  handleImpressumClose(event) {
    event.stopPropagation();
    this.closeImpressum();
  }

  handlePanelPointerEnter() {
    this.handlePeekHover({ hovering: true });
  }

  handlePanelPointerLeave() {
    this.handlePeekHover({ hovering: false });
  }

  handleKeydown(event) {
    if (event.key !== 'Escape') return;

    if (this.showingImpressum) {
      this.closeImpressum();
    } else if (this.state.open) {
      this.setState({ open: false });
    }
  }

  openImpressum() {
    if (this.showingImpressum || !this.state.open) return;

    this.showingImpressum = true;
    this.isClosing = true;
    const impressumTop = this.setOpenPosition(this.ref.impressumPanel);
    this.ref.impressumPanel.setAttribute('aria-hidden', 'false');
    this.ref.impressumContent.classList.replace('opacity-0', 'opacity-100');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const impressumY = this.ref.impressumPanel.offsetHeight;

    gsap.killTweensOf([this.ref.panel, this.ref.impressumPanel]);
    gsap.set(this.ref.impressumPanel, { y: impressumY });
    gsap.to(this.ref.panel, {
      y: -(window.innerHeight + this.ref.panel.offsetHeight),
      duration: reduceMotion ? 0 : 0.5,
      ease: 'power3.inOut',
    });
    gsap.to(this.ref.impressumPanel, {
      y: 0,
      duration: reduceMotion ? 0 : 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        this.movePanelIntoDocumentFlow(this.ref.impressumPanel, impressumTop);
        this.isClosing = false;
      },
    });
  }

  closeImpressum() {
    if (!this.showingImpressum) return;

    this.isClosing = true;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const closedY = this.resetPanelToViewport(this.ref.impressumPanel);

    gsap.killTweensOf([this.ref.panel, this.ref.impressumPanel]);
    gsap.to(this.ref.impressumPanel, {
      y: closedY,
      duration: reduceMotion ? 0 : 0.5,
      ease: 'power3.inOut',
    });
    gsap.to(this.ref.panel, {
      y: 0,
      duration: reduceMotion ? 0 : 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        this.showingImpressum = false;
        this.isClosing = false;
        this.ref.impressumPanel.setAttribute('aria-hidden', 'true');
        this.ref.impressumContent.classList.replace('opacity-100', 'opacity-0');
      },
    });
  }

  stateChange(changes) {
    if (!('open' in changes)) return;

    const open = changes.open;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.isClosing = !open;

    if (open) {
      const openTop = this.setOpenPosition(this.ref.panel);

      gsap.set(this.ref.panel, { y: this.getClosedY() });
      gsap.to(this.ref.panel, {
        y: 0,
        duration: reduceMotion ? 0 : 0.5,
        ease: 'power3.out',
        onComplete: () => this.movePanelIntoDocumentFlow(this.ref.panel, openTop),
      });
    } else {
      const closedY = this.resetPanelToViewport(this.ref.panel);

      gsap.to(this.ref.panel, {
        y: closedY,
        duration: reduceMotion ? 0 : 0.5,
        ease: 'power3.out',
        onComplete: () => {
          this.isClosing = false;
          this.element.style.minHeight = '';
        },
      });
    }

    this.ref.backdrop.classList.toggle('pointer-events-auto', open);
    this.ref.backdrop.classList.toggle('pointer-events-none', !open);
    this.ref.backdrop.setAttribute('aria-hidden', String(!open));
    this.ref.panel.setAttribute('aria-hidden', String(!open));
    this.ref.content.classList.toggle('opacity-0', !open);
    this.ref.content.classList.toggle('opacity-100', open);
    eventbus.emit('infoPanel:change', { open });
  }
}
