import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
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
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import TitleOutlinedIcon from '@mui/icons-material/TitleOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import {
  DEFAULT_RESEARCH_CONTENT,
  getResearchContent,
  saveResearchContent,
} from '../../../services/researchContentService';

const ICON_OPTIONS = [
  { value: 'verified', label: 'Verified / Robust AI', icon: <VerifiedUserOutlinedIcon fontSize="small" sx={{ color: '#3B82F6' }} /> },
  { value: 'memory', label: 'Memory / CPS', icon: <MemoryOutlinedIcon fontSize="small" sx={{ color: '#06B6D4' }} /> },
  { value: 'manufacturing', label: 'Manufacturing / Automation', icon: <PrecisionManufacturingOutlinedIcon fontSize="small" sx={{ color: '#8B5CF6' }} /> },
  { value: 'insights', label: 'Insights / Analytics', icon: <InsightsOutlinedIcon fontSize="small" sx={{ color: '#10B981' }} /> },
  { value: 'security', label: 'Cybersecurity & Defense', icon: <SecurityOutlinedIcon fontSize="small" sx={{ color: '#EF4444' }} /> },
  { value: 'code', label: 'Software & Code Verification', icon: <CodeOutlinedIcon fontSize="small" sx={{ color: '#F59E0B' }} /> },
];

const AdminResearch = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const showDialog = useAlerts('dialog');

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState(DEFAULT_RESEARCH_CONTENT);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getResearchContent();
        if (data) {
          setContent(data);
        }
      } catch (err) {
        console.error('Failed to load research content in admin:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResearchContent(content);
      showDialog('Saved', 'Research page content has been saved successfully to Firestore!', 'OK');
    } catch (err) {
      console.error('Error saving research content:', err);
      showDialog('Error', `Failed to save content to Firestore: ${err.message}`, 'OK');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all research page content back to lab defaults?')) {
      setContent(DEFAULT_RESEARCH_CONTENT);
    }
  };

  // Header change handler
  const handleHeaderChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [field]: value,
      },
    }));
  };

  // Focus Areas change handlers
  const handleFocusMetaChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      focusAreas: {
        ...prev.focusAreas,
        [field]: value,
      },
    }));
  };

  const handleTopicChange = (index, field, value) => {
    const list = [...(content.focusAreas.topics || [])];
    list[index] = { ...list[index], [field]: value };
    handleFocusMetaChange('topics', list);
  };

  const handleAddTopic = () => {
    const list = [...(content.focusAreas.topics || [])];
    list.push({
      id: `topic-${Date.now()}`,
      title: 'New Focus Area Title',
      desc: 'Describe the foundational principles, algorithms, and application goals of this research area.',
      iconType: 'verified',
    });
    handleFocusMetaChange('topics', list);
  };

  const handleRemoveTopic = (index) => {
    const list = [...(content.focusAreas.topics || [])];
    list.splice(index, 1);
    handleFocusMetaChange('topics', list);
  };

  // Application Domains change handlers
  const handleDomainMetaChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      applicationDomains: {
        ...prev.applicationDomains,
        [field]: value,
      },
    }));
  };

  const handleDomainItemChange = (index, value) => {
    const list = [...(content.applicationDomains.domains || [])];
    list[index] = value;
    handleDomainMetaChange('domains', list);
  };

  const handleAddDomain = () => {
    const list = [...(content.applicationDomains.domains || [])];
    list.push('New Industrial Domain / Sector');
    handleDomainMetaChange('domains', list);
  };

  const handleRemoveDomain = (index) => {
    const list = [...(content.applicationDomains.domains || [])];
    list.splice(index, 1);
    handleDomainMetaChange('domains', list);
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
              Research Page Content Manager
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Live editor for Page Header, Key Research Focus Areas, and Application Domains. All updates persist directly to Firestore.
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
              icon={<TitleOutlinedIcon />}
              iconPosition="start"
              label="Page Header & Overview"
              sx={{ fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' }}
            />
            <Tab
              icon={<ScienceOutlinedIcon />}
              iconPosition="start"
              label="Key Research Focus Areas"
              sx={{ fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' }}
            />
            <Tab
              icon={<CategoryOutlinedIcon />}
              iconPosition="start"
              label="Application Domains"
              sx={{ fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' }}
            />
          </Tabs>
        </Box>

        {/* ============================================================== */}
        {/* TAB 0: PAGE HEADER & OVERVIEW                                   */}
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
                  Hero Header & Description
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Eyebrow / Category Tag"
                      value={content.header.eyebrow || ''}
                      onChange={(e) => handleHeaderChange('eyebrow', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Main Page Title"
                      value={content.header.title || ''}
                      onChange={(e) => handleHeaderChange('title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Lead Summary / Mission Description"
                      value={content.header.description || ''}
                      onChange={(e) => handleHeaderChange('description', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* ============================================================== */}
        {/* TAB 1: KEY RESEARCH FOCUS AREAS                                 */}
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
                  Focus Areas Section Header
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Section Title"
                      value={content.focusAreas.title || ''}
                      onChange={(e) => handleFocusMetaChange('title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Section Subtitle"
                      value={content.focusAreas.subtitle || ''}
                      onChange={(e) => handleFocusMetaChange('subtitle', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Focus Topics ({content.focusAreas.topics?.length || 0})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddTopic}
                sx={{ borderRadius: '9999px', px: 2.5 }}
              >
                Add Focus Area
              </Button>
            </Box>

            <Grid container spacing={3}>
              {(content.focusAreas.topics || []).map((topic, index) => (
                <Grid item xs={12} sm={6} key={topic.id || index}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      border: '1px solid',
                      borderColor: theme.palette.divider,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: isDark ? 'rgba(15, 21, 35, 0.6)' : '#FFFFFF',
                      p: 2.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Card Icon</InputLabel>
                        <Select
                          value={topic.iconType || 'verified'}
                          label="Card Icon"
                          onChange={(e) => handleTopicChange(index, 'iconType', e.target.value)}
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {opt.icon}
                                <span>{opt.label}</span>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Tooltip title="Delete this focus area">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleRemoveTopic(index)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Topic Title"
                        value={topic.title || ''}
                        onChange={(e) => handleTopicChange(index, 'title', e.target.value)}
                      />
                      <TextField
                        size="small"
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        value={topic.desc || ''}
                        onChange={(e) => handleTopicChange(index, 'desc', e.target.value)}
                      />
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* ============================================================== */}
        {/* TAB 2: APPLICATION DOMAINS                                      */}
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
                  Application Domains Header
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Section Title"
                      value={content.applicationDomains.title || ''}
                      onChange={(e) => handleDomainMetaChange('title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Section Subtitle"
                      value={content.applicationDomains.subtitle || ''}
                      onChange={(e) => handleDomainMetaChange('subtitle', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Industry Application Sectors ({content.applicationDomains.domains?.length || 0})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddDomain}
                sx={{ borderRadius: '9999px', px: 2.5 }}
              >
                Add Domain
              </Button>
            </Box>

            <Grid container spacing={2}>
              {(content.applicationDomains.domains || []).map((domain, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: theme.palette.divider,
                      backgroundColor: isDark ? 'rgba(15, 21, 35, 0.6)' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <TextField
                      size="small"
                      fullWidth
                      label={`Domain #${index + 1}`}
                      value={domain || ''}
                      onChange={(e) => handleDomainItemChange(index, e.target.value)}
                    />
                    <Tooltip title="Delete domain">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleRemoveDomain(index)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
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

export default AdminResearch;
