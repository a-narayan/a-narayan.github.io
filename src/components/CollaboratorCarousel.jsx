import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { DEFAULT_HOME_CONTENT, getHomeContent } from '../services/homeContentService';

export const collaborators = DEFAULT_HOME_CONTENT.collaborators.items;

const CollaboratorCarousel = ({ title: propTitle, items: propItems }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [collabData, setCollabData] = useState(() => ({
    title: propTitle || DEFAULT_HOME_CONTENT.collaborators.title,
    items: propItems || DEFAULT_HOME_CONTENT.collaborators.items,
  }));

  useEffect(() => {
    if (propTitle || propItems) {
      setCollabData({
        title: propTitle || DEFAULT_HOME_CONTENT.collaborators.title,
        items: propItems && propItems.length > 0 ? propItems : DEFAULT_HOME_CONTENT.collaborators.items,
      });
      return;
    }

    let isMounted = true;
    getHomeContent().then((content) => {
      if (isMounted && content?.collaborators) {
        setCollabData({
          title: content.collaborators.title || DEFAULT_HOME_CONTENT.collaborators.title,
          items:
            Array.isArray(content.collaborators.items) && content.collaborators.items.length > 0
              ? content.collaborators.items
              : DEFAULT_HOME_CONTENT.collaborators.items,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [propTitle, propItems]);

  const activeItems = collabData.items && collabData.items.length > 0 ? collabData.items : collaborators;

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const isPausedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Triple list for infinite seamless scrolling
  const carouselItems = [...activeItems, ...activeItems, ...activeItems];

  // Auto-movement loop using requestAnimationFrame
  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const scrollLoop = (currentTime) => {
      const elapsed = currentTime - lastTime;
      lastTime = currentTime;

      if (!isPausedRef.current && containerRef.current && trackRef.current) {
        // Smooth constant speed: ~40px per second
        const step = elapsed * 0.04;
        containerRef.current.scrollLeft += step;

        const singleSetWidth = trackRef.current.scrollWidth / 3;
        if (singleSetWidth > 0 && containerRef.current.scrollLeft >= singleSetWidth * 2) {
          containerRef.current.scrollLeft -= singleSetWidth;
        }
      }

      animId = requestAnimationFrame(scrollLoop);
    };

    animId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Mouse drag handlers to allow manual scrolling by dragging
  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    isPausedRef.current = true;
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const stopDragging = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setTimeout(() => {
      isPausedRef.current = false;
    }, 1200);
  };

  // Button scroll helpers
  const handleScroll = useCallback((direction) => {
    if (!containerRef.current) return;
    isPausedRef.current = true;
    const scrollAmount = 300;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(() => {
      isPausedRef.current = false;
    }, 2000);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        p: { xs: 2.5, md: 3 },
        borderRadius: '20px',
        backgroundColor: isDark ? 'rgba(15, 21, 35, 0.5)' : 'rgba(241, 245, 249, 0.7)',
        border: '1px solid',
        borderColor: theme.palette.divider,
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: isDark ? '#94A3B8' : '#64748B',
          }}
        >
          {collabData.title || 'Key Academic & Industry Collaborators'}
        </Typography>
      </Box>

      {/* Main Scrollable Carousel Container */}
      <Box sx={{ position: 'relative' }}>
        {/* Left Arrow Button */}
        <IconButton
          onClick={() => handleScroll('left')}
          size="small"
          aria-label="Scroll left"
          sx={{
            position: 'absolute',
            left: 4,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            backgroundColor: isDark ? 'rgba(15, 21, 35, 0.85)' : 'rgba(255, 255, 255, 0.9)',
            border: '1px solid',
            borderColor: theme.palette.divider,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            color: theme.palette.text.primary,
            '&:hover': {
              backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>

        {/* Right Arrow Button */}
        <IconButton
          onClick={() => handleScroll('right')}
          size="small"
          aria-label="Scroll right"
          sx={{
            position: 'absolute',
            right: 4,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            backgroundColor: isDark ? 'rgba(15, 21, 35, 0.85)' : 'rgba(255, 255, 255, 0.9)',
            border: '1px solid',
            borderColor: theme.palette.divider,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            color: theme.palette.text.primary,
            '&:hover': {
              backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>

        {/* Left Edge Gradient Fade */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '40px',
            pointerEvents: 'none',
            zIndex: 2,
            background: isDark
              ? 'linear-gradient(to right, rgba(15, 21, 35, 0.85), transparent)'
              : 'linear-gradient(to right, rgba(241, 245, 249, 0.9), transparent)',
          }}
        />

        {/* Right Edge Gradient Fade */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '40px',
            pointerEvents: 'none',
            zIndex: 2,
            background: isDark
              ? 'linear-gradient(to left, rgba(15, 21, 35, 0.85), transparent)'
              : 'linear-gradient(to left, rgba(241, 245, 249, 0.9), transparent)',
          }}
        />

        {/* Scroll Track Container */}
        <Box
          ref={containerRef}
          onMouseEnter={() => {
            isPausedRef.current = true;
          }}
          onMouseLeave={() => {
            if (!isDragging) {
              isPausedRef.current = false;
            }
            stopDragging();
          }}
          onTouchStart={() => {
            isPausedRef.current = true;
          }}
          onTouchEnd={() => {
            setTimeout(() => {
              isPausedRef.current = false;
            }, 1500);
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            overflowY: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            py: 1,
            px: 2,
          }}
        >
          <Box
            ref={trackRef}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              flexWrap: 'nowrap',
              width: 'max-content',
            }}
          >
            {carouselItems.map((collab, index) => (
              <Box
                key={`${collab.id}-${index}`}
                sx={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 3,
                  py: 1.5,
                  minWidth: { xs: '150px', sm: '180px' },
                  height: '62px',
                  borderRadius: '14px',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                  backdropFilter: isDark ? 'blur(8px)' : 'none',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                  boxShadow: isDark
                    ? '0 4px 14px rgba(0, 0, 0, 0.3)'
                    : '0 2px 10px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background-color 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-2px) scale(1.02)',
                    borderColor: isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(29, 78, 216, 0.35)',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
                    boxShadow: isDark
                      ? '0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 0 16px -2px rgba(59, 130, 246, 0.25)'
                      : '0 8px 20px -4px rgba(0, 0, 0, 0.12), 0 0 12px -2px rgba(29, 78, 216, 0.15)',
                  },
                }}
              >
                <img
                  src={collab.logoUrl}
                  alt={collab.name}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to local verified SVG if external link is unavailable
                    if (e.currentTarget.src !== window.location.origin + collab.fallbackUrl) {
                      e.currentTarget.src = collab.fallbackUrl;
                    }
                  }}
                  style={{
                    maxHeight: `${collab.maxHeight}px`,
                    maxWidth: '140px',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    filter: isDark ? 'invert(1) hue-rotate(180deg) contrast(1.15) brightness(1.1)' : 'none',
                    display: 'block',
                    pointerEvents: 'none',
                    transition: 'filter 0.2s ease',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CollaboratorCarousel;

