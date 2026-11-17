import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { SectionWrapper } from '../../../components';
import { useTheme } from '@mui/material/styles';
import { useAlerts } from '../../../hooks/useAlerts';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import {
  DEFAULT_HOME_CONTENT,
  getHomeContent,
  saveHomeContent,
} from '../../../services/homeContentService';

const AdminHome = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const showDialog = useAlerts('dialog');

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState(DEFAULT_HOME_CONTENT);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getHomeContent();
        if (data) {
          setContent(data);
        }
      } catch (err) {
        console.error('Failed to load home content in admin:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveHomeContent(content);
      showDialog('Saved', 'Home page content has been saved successfully to Firestore!', 'OK');
    } catch (err) {
      console.error('Error saving home content:', err);
      showDialog('Error', `Failed to save content to Firestore: ${err.message}`, 'OK');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all home content back to lab defaults?')) {
      setContent(DEFAULT_HOME_CONTENT);
    }
  };

  // About Section Handlers
  const handleAboutChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value,
      },
    }));
  };

  const handleAffiliationChange = (index, field, value) => {
    const list = [...(content.about.affiliations || [])];
    list[index] = { ...list[index], [field]: value };
    handleAboutChange('affiliations', list);
  };

  const handleAddAffiliation = () => {
    const list = [...(content.about.affiliations || [])];
    list.push({ label: 'New Institution', sub: 'Department' });
    handleAboutChange('affiliations', list);
  };

  const handleRemoveAffiliation = (index) => {
    const list = [...(content.about.affiliations || [])];
    list.splice(index, 1);
    handleAboutChange('affiliations', list);
  };

  // Research Section Handlers
  const handleResearchMetaChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      research: {
        ...prev.research,
        [field]: value,
      },
    }));
  };

  const handleAreaChange = (index, field, value) => {
    const list = [...(content.research.areas || [])];
    list[index] = { ...list[index], [field]: value };
    handleResearchMetaChange('areas', list);
  };

  const handleAddArea = () => {
    const list = [...(content.research.areas || [])];
    list.push({
      id: `area-${Date.now()}`,
      tag: 'NEW RESEARCH PILLAR',
      title: 'New Research Pillar Title',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80',
      description: 'Describe the foundational concepts, methodology, and applications of this research pillar.',
    });
    handleResearchMetaChange('areas', list);
  };

  const handleRemoveArea = (index) => {
    const list = [...(content.research.areas || [])];
    list.splice(index, 1);
    handleResearchMetaChange('areas', list);
  };

  // Collaborators Section Handlers
  const handleCollabMetaChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      collaborators: {
        ...prev.collaborators,
        [field]: value,
      },
    }));
  };

  const handleCollabChange = (index, field, value) => {
    const list = [...(content.collaborators.items || [])];
    list[index] = { ...list[index], [field]: value };
    handleCollabMetaChange('items', list);
  };

  const handleAddCollab = () => {
    const list = [...(content.collaborators.items || [])];
    list.push({
      id: `collab-${Date.now()}`,
      name: 'New Collaborator',
      category: 'Industry / Academic Partner',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
      fallbackUrl: '/assets/logos/microsoft.svg',
      maxHeight: 28,
    });
    handleCollabMetaChange('items', list);
  };

  const handleRemoveCollab = (index) => {
    const list = [...(content.collaborators.items || [])];
    list.splice(index, 1);
    handleCollabMetaChange('items', list);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <SectionWrapper showBottomLine={false}>
        {/* Header with Title and Global Actions */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 4,
            pb: 3,
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              Home Page Content Manager
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Live editor for About IDSL, Research Pillars, and Key Collaborators. Changes save directly to Firestore.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<RestartAltIcon />}
              onClick={handleResetDefaults}
              sx={{ borderRadius: '9999px', px: 2.5 }}
            >
              Reset Defaults
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
              disabled={saving}
              onClick={handleSave}
              sx={{ borderRadius: '9999px', px: 3, fontWeight: 700 }}
            >
              {saving ? 'Saving...' : 'Save to Firestore'}
            </Button>
          </Box>
        </Box>

        {/* Section Navigation Tabs */}
        <Box sx={{ mb: 4, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
          <Tabs
            value={tabValue}
            onChange={(e, val) => setTabValue(val)}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<InfoOutlinedIcon />}
              iconPosition="start"
              label="About IDSL Section"
              sx={{ fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' }}
            />
            <Tab
              icon={<ScienceOutlinedIcon />}
              iconPosition="start"
              label="IDSL Research Section"
              sx={{ fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' }}
            />
            <Tab
              icon={<BusinessOutlinedIcon />}
              iconPosition="start"
              label="Key Collaborators"
              sx={{ fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' }}
            />
          </Tabs>
        </Box>

        {/* ============================================================== */}
        {/* TAB 0: ABOUT IDSL SECTION                                       */}
        {/* ============================================================== */}
        {tabValue === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            <Card
              sx={{
                borderRadius: '16px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.6)' : '#FFFFFF',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Section Heading & Mission
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Eyebrow / Category Tag"
                      value={content.about.eyebrow || ''}
                      onChange={(e) => handleAboutChange('eyebrow', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Section Title"
                      value={content.about.title || ''}
                      onChange={(e) => handleAboutChange('title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Lab Mission / Lead Summary"
                      value={content.about.description || ''}
                      onChange={(e) => handleAboutChange('description', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: '16px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.6)' : '#FFFFFF',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Lab Director Information
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Director Name"
                      value={content.about.directorName || ''}
                      onChange={(e) => handleAboutChange('directorName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Director Title / Role"
                      value={content.about.directorTitle || ''}
                      onChange={(e) => handleAboutChange('directorTitle', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Director Profile Photo URL"
                      value={content.about.directorImage || ''}
                      onChange={(e) => handleAboutChange('directorImage', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="img"
                      src={content.about.directorImage}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_HOME_CONTENT.about.directorImage;
                      }}
                      sx={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid',
                        borderColor: theme.palette.primary.main,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Photo Preview
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Director Bio Text"
                      value={content.about.directorBio || ''}
                      onChange={(e) => handleAboutChange('directorBio', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={content.about.email || ''}
                      onChange={(e) => handleAboutChange('email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="LinkedIn Profile URL"
                      value={content.about.linkedin || ''}
                      onChange={(e) => handleAboutChange('linkedin', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Google Scholar URL"
                      value={content.about.googleScholar || ''}
                      onChange={(e) => handleAboutChange('googleScholar', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Faculty Directory Link"
                      value={content.about.facultyDirectory || ''}
                      onChange={(e) => handleAboutChange('facultyDirectory', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: '16px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.6)' : '#FFFFFF',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Academic Affiliations
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAddAffiliation}
                    sx={{ borderRadius: '9999px' }}
                  >
                    Add Affiliation
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {(content.about.affiliations || []).map((aff, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          border: '1px solid',
                          borderColor: theme.palette.divider,
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                        }}
                      >
                        <TextField
                          size="small"
                          label="Institution"
                          value={aff.label || ''}
                          onChange={(e) => handleAffiliationChange(index, 'label', e.target.value)}
                          sx={{ flexGrow: 1 }}
                        />
                        <TextField
                          size="small"
                          label="Department / Program"
                          value={aff.sub || ''}
                          onChange={(e) => handleAffiliationChange(index, 'sub', e.target.value)}
                          sx={{ flexGrow: 1 }}
                        />
                        <Tooltip title="Delete affiliation">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleRemoveAffiliation(index)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* ============================================================== */}
        {/* TAB 1: IDSL RESEARCH SECTION                                    */}
        {/* ============================================================== */}
        {tabValue === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            <Card
              sx={{
                borderRadius: '16px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.6)' : '#FFFFFF',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Research Section Header
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Eyebrow / Tag"
                      value={content.research.eyebrow || ''}
                      onChange={(e) => handleResearchMetaChange('eyebrow', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Section Title"
                      value={content.research.title || ''}
                      onChange={(e) => handleResearchMetaChange('title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Section Description"
                      value={content.research.description || ''}
                      onChange={(e) => handleResearchMetaChange('description', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Research Pillars ({content.research.areas?.length || 0})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddArea}
                sx={{ borderRadius: '9999px', px: 2.5 }}
              >
                Add Research Pillar
              </Button>
            </Box>

            <Grid container spacing={3}>
              {(content.research.areas || []).map((area, index) => (
                <Grid item xs={12} md={6} key={area.id || index}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      border: '1px solid',
                      borderColor: theme.palette.divider,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: isDark ? 'rgba(15, 21, 35, 0.6)' : '#FFFFFF',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        height: '160px',
                        overflow: 'hidden',
                        backgroundColor: '#0F172A',
                      }}
                    >
                      <Box
                        component="img"
                        src={area.imageUrl}
                        alt={area.title}
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80';
                        }}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(0, 0, 0, 0.65)',
                          borderRadius: '8px',
                        }}
                      >
                        <Tooltip title="Delete this pillar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveArea(index)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Tag / Category"
                        value={area.tag || ''}
                        onChange={(e) => handleAreaChange(index, 'tag', e.target.value)}
                      />
                      <TextField
                        size="small"
                        fullWidth
                        label="Pillar Title"
                        value={area.title || ''}
                        onChange={(e) => handleAreaChange(index, 'title', e.target.value)}
                      />
                      <TextField
                        size="small"
                        fullWidth
                        label="Image URL"
                        value={area.imageUrl || ''}
                        onChange={(e) => handleAreaChange(index, 'imageUrl', e.target.value)}
                      />
                      <TextField
                        size="small"
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        value={area.description || ''}
                        onChange={(e) => handleAreaChange(index, 'description', e.target.value)}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* ============================================================== */}
        {/* TAB 2: KEY COLLABORATORS SECTION                                */}
        {/* ============================================================== */}
        {tabValue === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            <Card
              sx={{
                borderRadius: '16px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.6)' : '#FFFFFF',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Collaborators Section Header
                </Typography>
                <TextField
                  fullWidth
                  label="Section Title"
                  value={content.collaborators.title || ''}
                  onChange={(e) => handleCollabMetaChange('title', e.target.value)}
                />
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Active Collaborators ({content.collaborators.items?.length || 0})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddCollab}
                sx={{ borderRadius: '9999px', px: 2.5 }}
              >
                Add Collaborator
              </Button>
            </Box>

            <Grid container spacing={2.5}>
              {(content.collaborators.items || []).map((collab, index) => (
                <Grid item xs={12} sm={6} md={4} key={collab.id || index}>
                  <Card
                    sx={{
                      borderRadius: '14px',
                      border: '1px solid',
                      borderColor: theme.palette.divider,
                      backgroundColor: isDark ? 'rgba(15, 21, 35, 0.6)' : '#FFFFFF',
                      p: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '60px',
                        p: 1.5,
                        mb: 2,
                        borderRadius: '10px',
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                      }}
                    >
                      <img
                        src={collab.logoUrl}
                        alt={collab.name}
                        onError={(e) => {
                          if (collab.fallbackUrl && e.currentTarget.src !== window.location.origin + collab.fallbackUrl) {
                            e.currentTarget.src = collab.fallbackUrl;
                          }
                        }}
                        style={{
                          maxHeight: '32px',
                          maxWidth: '140px',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Organization Name"
                        value={collab.name || ''}
                        onChange={(e) => handleCollabChange(index, 'name', e.target.value)}
                      />
                      <TextField
                        size="small"
                        fullWidth
                        label="Category / Role"
                        value={collab.category || ''}
                        onChange={(e) => handleCollabChange(index, 'category', e.target.value)}
                      />
                      <TextField
                        size="small"
                        fullWidth
                        label="Logo Image URL"
                        value={collab.logoUrl || ''}
                        onChange={(e) => handleCollabChange(index, 'logoUrl', e.target.value)}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() => handleRemoveCollab(index)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Global Save Button at Bottom */}
        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleResetDefaults}
            sx={{ borderRadius: '9999px', px: 3 }}
          >
            Reset All Defaults
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={saving}
            onClick={handleSave}
            sx={{ borderRadius: '9999px', px: 4, fontWeight: 700 }}
          >
            {saving ? 'Saving Changes...' : 'Save All Changes to Firestore'}
          </Button>
        </Box>
      </SectionWrapper>
    </Box>
  );
};

export default AdminHome;
